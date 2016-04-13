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
  // CFregistration
  //
  plugin.breadcrumbCfregistrationLink = function breadcrumbCfregistrationLink(req, res) {
    return  '<li><a href="/event/'+res.locals.event.id+'/admin/cfregistrationtype">'+
      res.locals.__('cfregistration.find')+
    '</a></li>'
  };
  plugin.router.breadcrumb.add('adminCfregistrationFindAll', function adminCfregistrationFindAll(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('cfregistration.find')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCfregistrationCreate', function adminCfregistrationCreate(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbCfregistrationLink(req, res)+
        '<li class="active">'+res.locals.__('cfregistration.create')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCfregistrationFindOne', function adminCfregistrationFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbCfregistrationLink(req, res)+
        '<li class="active">COD: '+res.locals.data.id+'</li>'+
      '</ol>';
      next();
    }
  );

  //
  // CFregistrationType
  //
  plugin.router.breadcrumb.add('admincfregistrationtypeFind', function admincfregistrationtypeFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('cfregistrationtype.find')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.breadcrumbCfregistrationTypeLink = function breadcrumbCfregistrationTypeLink(req, res) {
    return  '<li><a href="/event/'+res.locals.event.id+'/admin/cfregistrationtype">'+
      res.locals.__('cfregistrationtype.find')+
    '</a></li>'
  };
  plugin.router.breadcrumb.add('admincfregistrationtypeCreate', function admincfregistrationtypeFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbCfregistrationTypeLink(req, res) +
        '<li class="active">'+res.locals.__('cfregistrationtype.create')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('admincfregistrationtypeFindOne',
    function admincfregistrationtypeFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li><a href="/event/'+res.locals.event.id+'/admin/cfregistrationtype">'+
          res.locals.__('cfregistrationtype.find')+
        '</a></li>'+
        '<li class="active">'+req.we.utils.string(res.locals.data.name || '').truncate(25).s+'</li>'+
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
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbMenuLink(req, res)+
        '<li class="active">'+req.we.utils.string(res.locals.data.name || '').truncate(25).s+'</li>'+
      '</ol>';
      next();
    }
  );

  //
  // CFPages
  //
  plugin.router.breadcrumb.add('adminCfPageFind', function adminCfPageFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('cfpage.managePage')+'</li>'+
      '</ol>';
      next();
    }
  );

  plugin.breadcrumbCfpageLink = function breadcrumbCfpageLink(req, res) {
    return  '<li><a href="/event/'+res.locals.event.id+'/cfpage">'+
      res.locals.__('cfpage.find')+
    '</a></li>';
  };
  plugin.router.breadcrumb.add('cfPageFind', function cfPageFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
          '<li class="active">'+
            res.locals.__('cfpage.find')+
          '</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('cfPageFindOne', function cfPageFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
          plugin.breadcrumbCfpageLink(req, res)+
        '<li class="active">'+res.locals.data.title+'</li>'+
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

  //
  // Event topics
  //
  plugin.router.breadcrumb.add('adminCftopicFind', function adminCftopicFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('cftopic.managePage')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('cftopicFind', function cftopicFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('cftopic.managePage')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('cftopicFindOne', function cftopicFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('cftopic.managePage')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.breadcrumbCftopicLink = function breadcrumbCftopicLink(req, res) {
    return  '<li><a href="/event/'+res.locals.event.id+'/admin/topic">'+
      res.locals.__('cftopic.managePage')+
    '</a></li>';
  };
  plugin.router.breadcrumb.add('adminCftopicFindOne', function adminCftopicFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbCftopicLink(req, res)+
        '<li class="active">'+res.locals.data.title+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCftopicCreate', function adminCftopicCreate(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbCftopicLink(req, res)+
        '<li class="active">'+res.locals.__('cftopic.create')+'</li>'+
      '</ol>';
      next();
    }
  );

  //
  // Event cfnews
  //
  plugin.router.breadcrumb.add('adminCfnewsFind', function adminCfnewsFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('cfnews.managePage')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.breadcrumbCfnewsLink = function breadcrumbCfnewsLink(req, res) {
    return  '<li><a href="/event/'+res.locals.event.id+'/admin/news">'+
      res.locals.__('cfnews.find')+
    '</a></li>';
  };
  plugin.router.breadcrumb.add('cfnewsFindAll', function cfnewsFindAll(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
        '<li class="active">'+res.locals.title+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('cfnewsFindOne', function cfnewsFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
        '<li><a href="/event/'+res.locals.event.id+'/cfnews">'+
          res.locals.__('cfnews.find')+
        '</a></li>'+
        '<li class="active">'+req.we.utils.string(res.locals.title || '').truncate(25).s+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCfnewsFindOne', function adminCfnewsFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbCfnewsLink(req, res)+
        '<li class="active">'+req.we.utils.string(res.locals.title || '').truncate(25).s+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('cfnewsCreate', function cfnewsCreate(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbCfnewsLink(req, res)+
        '<li class="active">'+res.locals.__('cfnews.create')+'</li>'+
      '</ol>';
      next();
    }
  );

  //
  // Event rooms
  //
  plugin.router.breadcrumb.add('adminCfroomFind', function adminCfroomFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('cfroom.managePage')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.breadcrumbAdminCfroomLink = function breadcrumbAdminCfroomLink(req, res) {
    return  '<li><a href="/event/'+res.locals.event.id+'/admin/room">'+
      res.locals.__('cfroom.find')+
    '</a></li>';
  };
  plugin.breadcrumbCfroomLink = function breadcrumbCfroomLink(req, res) {
    return  '<li><a href="/event/'+res.locals.event.id+'/cfroom">'+
      res.locals.__('cfroom.managePage')+
    '</a></li>';
  };
  plugin.router.breadcrumb.add('cfroomFind', function cfroomFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('cfroom.find')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCfroomFindOne', function adminCfroomFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbAdminCfroomLink(req, res)+
        '<li class="active">'+req.we.utils.string(res.locals.data.name || '').truncate(25).s+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCfroomCreate', function adminCfroomCreate(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbAdminCfroomLink(req, res)+
        '<li class="active">'+res.locals.__('cfrooms.create')+'</li>'+
      '</ol>';
      next();
    }
  );

  //
  // Event Sessions
  //
  plugin.router.breadcrumb.add('adminCfSessionFind', function adminCfSessionFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('cfsession.find')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.breadcrumbAdminCfsessionLink = function breadcrumbAdminCfsessionLink(req, res) {
    return  '<li><a href="/event/'+res.locals.event.id+'/admin/cfsession">'+
      res.locals.__('cfsession.find')+
    '</a></li>';
  };
  plugin.router.breadcrumb.add('adminCfSessionFindOne', function adminCfSessionFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbAdminCfsessionLink(req, res)+
        '<li class="active">'+req.we.utils.string(res.locals.data.title || '').truncate(25).s+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCfSessionCreate', function adminCfSessionCreate(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbAdminCfsessionLink(req, res)+
        '<li class="active">'+res.locals.__('cfsession.create')+'</li>'+
      '</ol>';
      next();
    }
  );

  //
  // Event Speakers
  //
  plugin.router.breadcrumb.add('cfspeakerFind', function cfspeakerFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
          '<li class="active">'+res.locals.title+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('cfspeakerFindOne', function cfspeakerFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
          '<li><a href="/event/'+res.locals.event.id+'/cfspeaker">'+
            res.locals.__('cfspeaker.find')+
          '</a></li>'+
          '<li class="active">'+req.we.utils.string(res.locals.title || '').truncate(25).s+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCFSpeakersFind', function adminCFSpeakersFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('cfspeaker.find')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.breadcrumbAdminCfSpeakerLink = function breadcrumbAdminCfSpeakerLink(req, res) {
    return  '<li><a href="/event/'+res.locals.event.id+'/admin/speaker">'+
      res.locals.__('cfspeaker.find')+
    '</a></li>';
  };
  plugin.router.breadcrumb.add('adminCFSpeakerFindOne', function adminCFSpeakerFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbAdminCfSpeakerLink(req, res)+
        '<li class="active">'+req.we.utils.string(res.locals.title || '').truncate(25).s+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCFSpeakerCreate', function adminCFSpeakerCreate(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbAdminCfSpeakerLink(req, res)+
        '<li class="active">'+res.locals.__('cfspeaker.create')+'</li>'+
      '</ol>';
      next();
    }
  );

  //
  // Event partner
  //
  plugin.router.breadcrumb.add('CFPartnerFind', function CFPartnerFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
          '<li class="active">'+res.locals.title+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('CFPartnerFindOne', function CFPartnerFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
          '<li><a href="/event/'+res.locals.event.id+'/cfpartner">'+
            res.locals.__('cfpartner.find')+
          '</a></li>'+
          '<li class="active">'+req.we.utils.string(res.locals.title || '').truncate(25).s+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCFPartnerFind', function adminCFPartnerFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.__('cfpartner.find')+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.breadcrumbAdminCFPartnerLink = function breadcrumbAdminCFPartnerLink(req, res) {
    return  '<li><a href="/event/'+res.locals.event.id+'/admin/parner">'+
      res.locals.__('cfpartner.find')+
    '</a></li>';
  };
  plugin.router.breadcrumb.add('adminCFPartnerFindOne', function adminCFPartnerFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbAdminCFPartnerLink(req, res)+
        '<li class="active">'+req.we.utils.string(res.locals.title || '').truncate(25).s+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCFPartnerCreate', function adminCFPartnerCreate(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbAdminCFPartnerLink(req, res)+
        '<li class="active">'+res.locals.title+'</li>'+
      '</ol>';
      next();
    }
  );

  //
  // Event video
  //
  plugin.router.breadcrumb.add('CFVideoFind', function CFVideoFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
          '<li class="active">'+res.locals.title+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('CFVideoFindOne', function CFVideoFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
          '<li><a href="/event/'+res.locals.event.id+'/cfvideo">'+
            res.locals.__('cfvideo.find')+
          '</a></li>'+
          '<li class="active">'+req.we.utils.string(res.locals.title || '').truncate(25).s+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCFVideoFind', function adminCFVideoFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.title+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.breadcrumbAdminCFVideoLink = function breadcrumbAdminCFVideoLink(req, res) {
    return  '<li><a href="/event/'+res.locals.event.id+'/admin/video">'+
      res.locals.__('cfvideo.find')+
    '</a></li>';
  };
  plugin.router.breadcrumb.add('adminCFVideoFindOne', function adminCFVideoFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbAdminCFVideoLink(req, res)+
        '<li class="active">'+req.we.utils.string(res.locals.title || '').truncate(25).s+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCFVideoCreate', function adminCFVideoCreate(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          plugin.breadcrumbAdminCFVideoLink(req, res)+
        '<li class="active">'+res.locals.title+'</li>'+
      '</ol>';
      next();
    }
  );

  //
  // Event video
  //
  plugin.router.breadcrumb.add('createCFContact', function createCFContact(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbBaseLinks(req, res)+
        '<li class="active">'+res.locals.title+'</li>'+
      '</ol>';
      next();
    }
  );

  plugin.router.breadcrumb.add('adminCFContactFind', function adminCFContactFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          '<li class="active">'+res.locals.title+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCFContactFindOne', function adminCFContactFindOne(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
          '<li><a href="/event/'+res.locals.event.id+'/admin/cfcontact">'+
            res.locals.__('cfcontact.find')+
          '</a></li>'+
          '<li class="active">Contact ID: '+res.locals.data.id+'</li>'+
      '</ol>';
      next();
    }
  );
  plugin.router.breadcrumb.add('adminCFVideoFind', function adminCFVideoFind(req, res, next) {
      res.locals.breadcrumb = '<ol class="breadcrumb">'+
          plugin.breadcrumbAdminBaseLinks(req, res)+
        '<li class="active">'+res.locals.title+'</li>'+
      '</ol>';
      next();
    }
  );
};