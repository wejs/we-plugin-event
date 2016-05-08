/**
 * Event breadcrumbs
 */
module.exports = function setBreadcrumbs(plugin) {
  plugin.breadcrumbBaseLinks = function breadcrumbBaseLinks(req, res) {
    return  '<li><a href="/">'+res.locals.__('Home')+'</a></li>'+
            '<li><a href="/event">'+res.locals.__('event.find')+'</a></li>'+
            '<li><a href="/event/'+res.locals.event.id+'">'+req.we.utils.string(res.locals.event.title || '').truncate(25).s+'</a></li>';
  }

  plugin.breadcrumbAdminBaseLinks = function breadcrumbAdminBaseLinks(req, res) {
    return  '<li><a href="/">'+res.locals.__('Home')+'</a></li>'+
            '<li><a href="/event">'+res.locals.__('event.find')+'</a></li>'+
            '<li><a href="/event/'+res.locals.event.id+'">'+req.we.utils.string(res.locals.event.title || '').truncate(25).s+'</a></li>'+
            '<li><a href="/event/'+res.locals.event.id+'/admin">'+res.locals.__('event_admin')+'</a></li>';
  }
  plugin.router.breadcrumb.add('eventAdmin', function eventAdmin(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
        '<li><a href="/">'+res.locals.__('Home')+'</a></li>'+
        '<li><a href="/event">'+res.locals.__('event.find')+'</a></li>'+
        '<li><a href="/event/'+res.locals.event.id+'">'+req.we.utils.string(res.locals.event.title || '').truncate(25).s+'</a></li>'+
        '<li class="active"><a href="/event/'+res.locals.event.id+'/admin">'+res.locals.__('event_admin')+'</a></li>'+
      '</ol>';
      next();
    }
  );

  //
  // CFMenu and links
  //
  plugin.breadcrumbMenuLink = function breadcrumbMenuLink(req, res) {
    return  '<li><a href="/event/'+res.locals.event.id+'/admin/cfmenu">'+
      res.locals.__('cfmenu.find')+
    '</a></li>'
  };
  plugin.router.breadcrumb.add('adminCfMenuFind', function adminCfMenuFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('event.structure.menus')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCfMenuFindCreate', function adminCfMenuFindCreate(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbMenuLink(req, res)+
        '<li class="active">'+res.locals.__('cfmenu.create')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCfMenuFindOne', function adminCfMenuFindOne(req, res, next) {
      if (!res.locals.data) return next();

      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbMenuLink(req, res)+
        '<li class="active">'+req.we.utils.string(res.locals.data.name || '').truncate(25).s+'</li>'+
      '</ol>';
      next();
    }
  );

  //
  // Event managers
  //
  plugin.router.breadcrumb.add('adminEventManagers', function adminEventManagers(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('event.managers')+'</li>'+
      '</ol>';
      next();
    }
  );
};