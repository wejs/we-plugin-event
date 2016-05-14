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