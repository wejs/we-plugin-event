/**
 * We.js we-plugin-conference plugin settings
 */
var async = require('async');

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);

  // set plugin configs
  plugin.setConfigs({
    conference: {
      // add a conference id for load in all conference portal as a single conference portal
      singleConferenceId: false,
      defaultTheme: 'we-theme-conference',
      models: [
        'conference',
        'cfcertification',
        'cfnews',
        'cfregistrationtype',
        'cfspeaker',
        'cfcontact',
        'cfpage',
        'cfroom',
        'cftopic',
        'cflink',
        'cfpartner',
        'cfsession',
        'cfvideo',
        'cfmenu',
        'cfregistration',
        'cfsessionSubscriber'
      ]
    },
    permissions: {
      'find_conference': {
        'title': 'Find conferences',
        'description': 'FindAll or findOne conference'
      },
      'create_conference': {
        'title': 'Create one conference',
        'description': ''
      },
      'update_conference': {
        'title': 'Update one conference',
        'description': ''
      },
      'delete_conference': {
        'title': 'Delete one conference',
        'description': ''
      },
      'manage_conference': {
        'title': 'Permission to manage one conference',
        'description': ''
      }
    },
    forms: {
      'user-cfsession': __dirname + '/server/forms/user-cfsession.json',
    }
  });

  plugin.setResource({
    name: 'conference',
    findOneLayout: 'conferenceHome',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    createPermisson: 'manage_conference',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference'
  });
  plugin.setResource({
    parent: 'conference',
    name: 'cfspeaker',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference',
    createPermisson: 'manage_conference'
  });
  plugin.setResource({
    parent: 'conference',
    name: 'cftopic',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference',
    createPermisson: 'manage_conference'
  });
  plugin.setResource({
    parent: 'conference',
    name: 'cfmenu',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference',
    createPermisson: 'manage_conference'
  });
  plugin.setResource({
    parent: 'conference',
    name: 'cfpage',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference',
    createPermisson: 'manage_conference'
  });
  plugin.setResource({
    parent: 'conference',
    name: 'cfnews',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference',
    createPermisson: 'manage_conference'
  });
  plugin.setResource({
    parent: 'conference',
    name: 'cfregistration',
    namespace: '/admin',

    findLayout: 'conferenceAdmin',
    findOneLayout: 'conferenceAdmin',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    createPermisson: 'manage_conference',
    findPermisson: 'manage_conference',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference'
  });
  plugin.setResource({
    parent: 'conference',
    name: 'cfroom',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference',
    createPermisson: 'manage_conference'
  });
  // sessions resource routes
  plugin.setResource({
    parent: 'conference',
    name: 'cfsession',
    namespace: '/admin',
    findLayout: 'conferenceAdmin',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    findPermission: 'manage_conference',
    findOnePermission: 'manage_conference',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference',
    createPermisson: 'manage_conference'
  });
  plugin.setResource({
    parent: 'conference',
    name: 'cfsession',
    namespace: '/user/:userId([0-9]+)',
    namePrefix: 'user.',
    templateFolderPrefix: 'conference/user/'
  });

  plugin.setResource({
    parent: 'conference',
    name: 'cfpartner',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference',
    createPermisson: 'manage_conference'
  });
  plugin.setResource({
    parent: 'conference',
    name: 'cfvideo',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference',
    createPermisson: 'manage_conference'
  });
  plugin.setResource({
    parent: 'conference',
    name: 'cfcontact',
    namespace: '/admin',
    findLayout: 'conferenceAdmin',
    findOneLayout: 'conferenceAdmin',
    editLayout: 'conferenceAdmin',
    createLayout: 'conferenceAdmin',
    deleteLayout: 'conferenceAdmin',
    findPermission: 'manage_conference',
    findOnePermission: 'manage_conference',
    editPermission: 'manage_conference',
    deletePermission: 'manage_conference'
  });
  // ser plugin routes
  plugin.setRoutes({
    'get /conference/:conferenceId([0-9]+)/register': {
      name          : 'conference_register',
      titleHandler  : 'i18n',
      titleI18n: 'conference.register',
      controller    : 'cfregistration',
      action        : 'register',
      model         : 'cfregistration',
      permission    : 'find_conference'
    },
    'post /conference/:conferenceId([0-9]+)/register': {
      titleHandler  : 'i18n',
      titleI18n: 'conference.register',
      controller    : 'cfregistration',
      action        : 'register',
      model         : 'cfregistration',
      permission    : 'find_conference'
    },

    'get /conference/:conferenceId([0-9]+)/un-register': {
      titleHandler  : 'i18n',
      titleI18n: 'cfregistration.unRegister',
      controller    : 'cfregistration',
      action        : 'unRegister',
      model         : 'cfregistration',
      permission    : 'find_conference'
    },
    'post /conference/:conferenceId([0-9]+)/un-register': {
      titleHandler  : 'i18n',
      titleI18n: 'conference.register',
      controller    : 'cfregistration',
      action        : 'unRegister',
      model         : 'cfregistration',
      permission    : 'find_conference'
    },

    // -- conference admin
    'get /conference/:conferenceId([0-9]+)/admin': {
      name          : 'conference_admin',
      layoutName    : 'conferenceAdmin',
      controller    : 'conference',
      action        : 'adminIndex',
      model         : 'conference',
      permission    : 'manage_conference',
      template      : 'conference/admin/index',
      responseType  : 'html'
    },
    // get edit widget
    'get /conference/:conferenceId([0-9]+)/admin/widget/:id([0-9]+)/form': {
      controller    : 'widget',
      action        : 'getForm',
      model         : 'widget',
      permission    : 'manage_widget',
      skipWidgets   : true
    },

    'post /conference/:conferenceId([0-9]+)/admin/widget/create': {
      controller    : 'conference',
      action        : 'saveWidget',
      model         : 'widget',
      permission    : 'manage_conference',
      responseType  : 'json'
    },
    'post /conference/:conferenceId([0-9]+)/admin/widget/:widgetId([0-9]+)': {
      controller    : 'conference',
      action        : 'saveWidget',
      model         : 'widget',
      permission    : 'manage_conference',
      responseType  : 'json'
    },
    'post /conference/:conferenceId([0-9]+)/admin/widget/:widgetId([0-9]+)/delete': {
      controller    : 'conference',
      action        : 'deleteWidget',
      model         : 'widget',
      permission    : 'manage_conference',
      responseType  : 'json'
    },

    // sort widgets
    'get /conference/:conferenceId([0-9]+)/admin/widget/sortWidgets/:theme/:layout/:regionName': {
      controller    : 'conference',
      action        : 'sortWidgets',
      model         : 'widget',
      permission    : 'manage_conference',
      responseType  : 'modal'
    },
    'post /conference/:conferenceId([0-9]+)/admin/widget/sortWidgets/:theme/:layout/:regionName': {
      controller    : 'conference',
      action        : 'sortWidgets',
      model         : 'widget',
      permission    : 'manage_conference',
      responseType  : 'modal'
    },


    // -- Pages
    'get /conference/:conferenceId([0-9]+)/admin/page': {
      titleHandler  : 'i18n',
      titleI18n     : 'cfpage.managePage',
      layoutName    : 'conferenceAdmin',
      name          : 'conference_findOne.page_manage',
      controller    : 'cfpage',
      action        : 'managePage',
      model         : 'cfpage',
      permission    : 'manage_conference',
      template      : 'conference/admin/cfpages',
    },
    // registration
    'get /conference/:conferenceId([0-9]+)/admin/cfregistration/:cfregistrationId/accept': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cfregistration',
      action        : 'accept',
      model         : 'cfregistration',
      permission    : 'manage_conference'
    },
    'get /conference/:conferenceId([0-9]+)/admin/cfregistration/export.csv': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cfregistration',
      action        : 'exportRegistration',
      model         : 'cfregistration',
      permission    : 'manage_conference',
      responseType  : 'cvs'
    },
    // registration type
    'get /conference/:conferenceId([0-9]+)/admin/cfregistration/type': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cfregistrationtype',
      action        : 'find',
      model         : 'cfregistrationtype',
      permission    : 'manage_conference',
    },
    'get /conference/:conferenceId([0-9]+)/admin/cfregistration/type/create': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cfregistrationtype',
      action        : 'create',
      model         : 'cfregistrationtype',
      permission    : 'manage_conference',
      template      : 'cfregistrationtype/form'
    },
    'post /conference/:conferenceId([0-9]+)/admin/cfregistration/type/create': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cfregistrationtype',
      action        : 'create',
      model         : 'cfregistrationtype',
      permission    : 'manage_conference',
      template      : 'cfregistrationtype/form'
    },
    // edit registration type
    'get /conference/:conferenceId([0-9]+)/admin/cfregistration/type/:cfregistrationtypeId([0-9]+)': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cfregistrationtype',
      action        : 'edit',
      model         : 'cfregistrationtype',
      permission    : 'manage_conference',
      template      : 'cfregistrationtype/form'
    },
    'post /conference/:conferenceId([0-9]+)/admin/cfregistration/type/:cfregistrationtypeId([0-9]+)': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cfregistrationtype',
      action        : 'edit',
      model         : 'cfregistrationtype',
      permission    : 'manage_conference',
      template      : 'cfregistrationtype/form'
    },
   // -- News
    'get /conference/:conferenceId([0-9]+)/admin/news': {
      layoutName    : 'conferenceAdmin',
      name          : 'conference_findOne.news_manage',
      titleHandler  : 'i18n',
      titleI18n     : 'cfnews.managePage',
      controller    : 'cfnews',
      action        : 'managePage',
      model         : 'cfnews',
      permission    : 'manage_conference',
      template      : 'conference/admin/cfnews',
    },
    // -- Menu

    'get /conference/:conferenceId([0-9]+)/admin/menu': {
      name          : 'conference_admin_menu',
      layoutName    : 'conferenceAdmin',
      controller    : 'cfmenu',
      action        : 'managePage',
      model         : 'cfmenu',
      permission    : 'manage_conference',
      template      : 'conference/admin/cfmenus',
      responseType  : 'html'
    },
    'get /conference/:conferenceId([0-9]+)/admin/menu/:cfmenuId([0-9]+)': {
      name          : 'conference_admin_menu',
      layoutName    : 'conferenceAdmin',
      controller    : 'cfmenu',
      action        : 'edit',
      model         : 'cfmenu',
      permission    : 'manage_conference',
      responseType  : 'html'
    },
    'post /conference/:conferenceId([0-9]+)/admin/menu/:cfmenuId([0-9]+)': {
      name          : 'conference_admin_menu',
      layoutName    : 'conferenceAdmin',
      controller    : 'cfmenu',
      action        : 'edit',
      model         : 'cfmenu',
      permission    : 'manage_conference',
      responseType  : 'html'
    },
    // add link
    'get /conference/:conferenceId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/add-link': {
      titleHandler  : 'i18n',
      titleI18n     : 'cflink.create',
      layoutName    : 'conferenceAdmin',
      controller    : 'cflink',
      action        : 'create',
      model         : 'cflink',
      permission    : 'manage_conference',
      responseType  : 'html'
    },
    'post /conference/:conferenceId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/add-link': {
      titleHandler  : 'i18n',
      titleI18n     : 'cflink.create',
      layoutName    : 'conferenceAdmin',
      controller    : 'cflink',
      action        : 'create',
      model         : 'cflink',
      permission    : 'manage_conference',
      responseType  : 'html'
    },
    'post /conference/:conferenceId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/sort-links': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cflink',
      action        : 'sortLinks',
      model         : 'cflink',
      permission    : 'manage_conference',
      responseType  : 'json'
    },

    'get /conference/:conferenceId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/link/:cflinkId([0-9]+)': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cflink',
      action        : 'edit',
      model         : 'cflink',
      permission    : 'manage_conference',
      responseType  : 'html'
    },
    'post /conference/:conferenceId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/link/:cflinkId([0-9]+)': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cflink',
      action        : 'edit',
      model         : 'cflink',
      permission    : 'manage_conference',
      responseType  : 'html'
    },
    'get /conference/:conferenceId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/link/:cflinkId([0-9]+)/delete': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cflink',
      action        : 'delete',
      model         : 'cflink',
      permission    : 'manage_conference',
      responseType  : 'html'
    },
    'post /conference/:conferenceId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/link/:cflinkId([0-9]+)/delete': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cflink',
      action        : 'delete',
      model         : 'cflink',
      permission    : 'manage_conference',
      responseType  : 'html'
    },
    // - create
    'get /conference/:conferenceId([0-9]+)/admin/menu/create': {
      titleHandler  : 'i18n',
      titleI18n     : 'cfmenu.create',
      layoutName    : 'conferenceAdmin',
      controller    : 'cfmenu',
      action        : 'create',
      model         : 'cfmenu',
      permission    : 'manage_conference'
    },
    'post /conference/:conferenceId([0-9]+)/admin/menu/create': {
      titleHandler  : 'i18n',
      titleI18n     : 'cfmenu.create',
      layoutName    : 'conferenceAdmin',
      controller    : 'cfmenu',
      action        : 'create',
      model         : 'cfmenu',
      permission    : 'manage_conference'
    },

    // -- Rooms
    'get /conference/:conferenceId([0-9]+)/admin/room': {
      titleHandler  : 'i18n',
      titleI18n     : 'cfroom.managePage',
      layoutName    : 'conferenceAdmin',
      controller    : 'cfroom',
      action        : 'find',
      model         : 'cfroom',
      permission    : 'manage_conference'
    },

    // - cftopics
    'get /conference/:conferenceId([0-9]+)/admin/topic': {
      layoutName    : 'conferenceAdmin',
      titleHandler  : 'i18n',
      titleI18n     : 'cftopic.managePage',
      controller    : 'cftopic',
      action        : 'managePage',
      model         : 'cftopic',
      permission    : 'manage_conference',
      template      : 'conference/admin/cftopics',
    },

    // - cfsession
    'post /conference/:conferenceId([0-9]+)/subscribe-in-session': {
      controller    : 'cfsession',
      action        : 'addRegistration',
      model         : 'cfsession',
      permission    : 'find_conference',
      responseType  : 'html'
    },

    'post /conference/:conferenceId([0-9]+)/unsubscribe-from-session': {
      controller    : 'cfsession',
      action        : 'removeRegistration',
      model         : 'cfsession',
      permission    : 'find_conference',
      responseType  : 'html'
    },

    // - cfcontact
    'get /conference/:conferenceId([0-9]+)/contact': {
      name          : 'conference_contact',
      titleHandler  : 'i18n',
      titleI18n     : 'conference.contact',
      controller    : 'cfcontact',
      action        : 'create',
      model         : 'cfcontact',
      permission    : 'find_conference'
    },
    'post /conference/:conferenceId([0-9]+)/contact': {
      titleHandler  : 'i18n',
      titleI18n     : 'conference.contact',
      controller    : 'cfcontact',
      action        : 'create',
      model         : 'cfcontact',
      permission    : 'find_conference'
    },

    'get /conference/:conferenceId([0-9]+)/admin/managers': {
      titleHandler  : 'i18n',
      titleI18n     : 'conference.setManagers',
      controller    : 'conference',
      action        : 'setManagers',
      model         : 'conference',
      permission    : 'manage_conference',
      layoutName    : 'conferenceAdmin',
      template      : 'conference/admin/managers'
    },
    'post /conference/:conferenceId([0-9]+)/admin/managers': {
      titleHandler  : 'i18n',
      titleI18n     : 'conference.setManagers',
      controller    : 'conference',
      action        : 'setManagers',
      model         : 'conference',
      permission    : 'manage_conference',
      layoutName    : 'conferenceAdmin',
      template      : 'conference/admin/managers'
    },
  });

  plugin.events.on('we:express:set:params', function (data) {
    var we = data.we;

    if (we.config.conference.singleConferenceId) {
      data.express.all('/*', function (req, res, next) {
        loadConferenceAndConferenceContext(
          req, res, next,
          we.config.conference.singleConferenceId
        );
      });
    } else {
      data.express.param('conferenceId', loadConferenceAndConferenceContext);
    }

  });

  plugin.hooks.on('we:router:request:after:load:context', function (data, done) {
    var we = data.req.we;

    // set admin menu
    if (
      data.res.locals.conference &&
      we.acl.canStatic('manage_conference', data.req.userRoleNames)
    ){
      data.res.locals.userMenu.addLink({
        id: 'conference_admin',
        dividerAfter: true,
        text: '<i class="glyphicon glyphicon-cog"></i> '+
          data.req.__('conference.menu.admin'),
        href: we.router.urlTo(
          'conference.findOne', [data.res.locals.conference.id], we
        ),
        parent: 'user',
        class: null,
        weight: 5
      });
    }

    done();
  });

  plugin.events.on('we:config:getAppBootstrapConfig', function(opts) {
    if (opts.context && opts.context.widgetContext && opts.context.conference) {
     opts.configs.widgetContext = opts.context.widgetContext;

     var cfID = opts.context.conference.id;

     opts.configs.structure.widgetCreateUrl = '/conference/'+cfID+'/admin/widget/create';
     opts.configs.structure.widgetUpdateUrl = '/conference/'+cfID+'/admin/widget/';
     opts.configs.structure.widgetDeleteUrl = '/conference/'+cfID+'/admin/widget/';
     opts.configs.structure.widgetSortUrl = '/conference/'+cfID+'/admin/widget/sortWidgets/';
     opts.configs.structure.widgetEditFormUrl = '/conference/'+cfID+'/admin/widget/';
    }
  });
  // conference loader
  function loadConferenceAndConferenceContext(req, res, next, id) {
    var we = req.we;
    we.db.models.conference.findOne({
      where: { id: id }, include: { all: true }
    }).then(function (cf) {
      if (!cf) return res.notFound();
      res.locals.title = cf.title;
      res.locals.conference = cf;
      res.locals.widgetContext = 'conference-' + res.locals.conference.id;

      if (req.body) req.body.conferenceId = cf.id;

      res.locals.conferenceService = ( we.config.conference.service || 'conference' );

      if (cf.theme) {
        res.locals.theme = cf.theme;
      } else {
        res.locals.theme = we.config.conference.defaultTheme;
      }
      // chage html to conference html
      res.locals.htmlTemplate = 'conference/html';

      async.parallel([
        function loadMainMenu(cb){
          if (!cf.mainMenu) return cb();
          cf.mainMenu.getLinks({
            order: [
              ['weight','ASC'], ['createdAt','ASC']
            ]
          }).then(function (links){
            cf.mainMenu.links = links;
            cb();
          }).catch(cb);
        },
        function loadSecondaryMenu(cb) {
          if (!cf.secondaryMenu) return cb();
          cf.secondaryMenu.getLinks({
            order: [
              ['weight','ASC'], ['createdAt','ASC']
            ]
          }).then(function (links){
            cf.secondaryMenu.links = links;
            cb();
          }).catch(cb);
        },
        function loadSocialMenu(cb) {
          if (!cf.socialMenu) return cb();
          cf.socialMenu.getLinks({
            order: [
              ['weight','ASC'], ['createdAt','ASC']
            ]
          }).then(function (links) {
            cf.socialMenu.links = links;
            cb();
          }).catch(cb);
        },
        function loadTopicImages(cb) {
          if (!cf.topics) return cb();
          we.file.image.afterFind.bind(we.db.models.cftopic)(cf.topics, null, cb)
        },
        function isRegistered(cb) {
          if (!req.isAuthenticated()) return cb();
          // load current user registration register
          we.db.models.cfregistration.findOne({
            where: { conferenceId: id, userId: req.user.id }
          }).then(function (r) {
            if (!r) return cb();
            res.locals.userCfregistration = r;
            req.userRoleNames.push('registeredInConference');
            cb();
          }).catch(cb);
        },
        function isManager(cb) {
          if (!req.isAuthenticated()) return cb();
          cf.isManager(req.user.id, function(err, isMNG){
            if (err) return cb(err);
            if (isMNG) {
              res.locals.isConferenceManager = isMNG;
              req.userRoleNames.push('conferenceManager');
            }
            cb();
          });
        },
        function cfregistrationCount(cb) {
          we.db.models.cfregistration.count({
            where: { status: 'registered' }
          }).then(function (count) {
            res.locals.metadata.cfRegistrationCount = count;
            cb();
          }).catch(cb);
        },
        function cfcontactCount(cb) {
          we.db.models.cfcontact.count()
          .then(function (count) {
            res.locals.metadata.cfcontactCount = count;
            cb();
          }).catch(cb);
        }
      ], next);
    });
  }

  return plugin;
};
