/**
 * We.js we-plugin-event plugin settings
 */

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);

  // set plugin configs
  plugin.setConfigs({
    event: {
      // add a event id for load in all event portal as a single event portal
      singleConferenceId: false,
      // a list of theme names avaible to events
      themes: [],
      // set default theme here, if is null the system will load the portal theme
      defaultTheme: null,
      models: [
        'event',
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
      'find_event': {
        'title': 'Find events',
        'description': 'FindAll or findOne event'
      },
      'create_event': {
        'title': 'Create one event',
        'description': ''
      },
      'update_event': {
        'title': 'Update one event',
        'description': ''
      },
      'delete_event': {
        'title': 'Delete one event',
        'description': ''
      },
      'manage_event': {
        'title': 'Permission to manage one event',
        'description': ''
      }
    },
    roles: {
      eventManager: {
        isSystemRole: true,
        permissions: [
          'find_event', 'create_event', 'update_event', 'delete_event', 'manage_event'
        ]
      }
    },
    forms: {
      'user-cfsession': __dirname + '/server/forms/user-cfsession.json',
      'event-about': __dirname + '/server/forms/event-about.json',
      'event-dates': __dirname + '/server/forms/event-dates.json',
      'event-emails': __dirname + '/server/forms/event-emails.json',
      'event-publish': __dirname + '/server/forms/event-publish.json',
      'event-theme': __dirname + '/server/forms/event-theme.json',
      'event-messages': __dirname + '/server/forms/event-messages.json',
      'event-managers-add': __dirname + '/server/forms/event-managers-add.json'
    }
  });

  plugin.setResource({
    name: 'event',
    findOne: { layoutName: 'eventHome' },
    edit: {
      permission: 'manage_event',
      layoutName: 'eventAdmin'
    },
    delete: {
      permission: 'manage_event',
      layoutName: 'eventAdmin'
    }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfspeaker',
    edit: { layoutName: 'eventAdmin' },
    create: { layoutName: 'eventAdmin' },
    delete: { layoutName: 'eventAdmin' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cftopic',
    edit: { layoutName: 'eventAdmin' },
    create: { layoutName: 'eventAdmin' },
    delete: { layoutName: 'eventAdmin' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfmenu',
    namespace: '/admin',
    layoutName: 'eventAdmin'
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfpage',
    edit: { layoutName: 'eventAdmin' },
    create: { layoutName: 'eventAdmin' },
    delete: { layoutName: 'eventAdmin' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfnews',
    edit: { layoutName: 'eventAdmin' },
    create: { layoutName: 'eventAdmin' },
    delete: { layoutName: 'eventAdmin' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfregistration',
    namespace: '/admin',
    layoutName: 'eventAdmin',
    findAll: {
      search: {
        id:  {
          parser: 'equal',
          target: {
            type: 'field',
            field: 'id'
          }
        },
        email:  {
          parser: 'equal',
          target: {
            type: 'association',
            model: 'user',
            field: 'email'
          }
        },
        displayName:  {
          parser: 'contains',
          target: {
            type: 'association',
            model: 'user',
            field: 'displayName'
          }
        }
      }
    }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfregistrationtype',
    namespace: '/admin',
    layoutName: 'eventAdmin'
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfroom',
    edit: { layoutName: 'eventAdmin' },
    create: { layoutName: 'eventAdmin' },
    delete: { layoutName: 'eventAdmin' }
  });
  // sessions resource routes
  plugin.setResource({
    parent: 'event',
    name: 'cfsession',
    namespace: '/admin',
    layoutName: 'eventAdmin'
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfsession',
    namespace: '/user/:userId([0-9]+)',
    namePrefix: 'user.',
    templateFolderPrefix: 'event/user/'
  });

  plugin.setResource({
    parent: 'event',
    name: 'cfpartner',
    edit: { layoutName: 'eventAdmin' },
    create: { layoutName: 'eventAdmin' },
    delete: { layoutName: 'eventAdmin' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfvideo',
    edit: { layoutName: 'eventAdmin' },
    create: { layoutName: 'eventAdmin' },
    delete: { layoutName: 'eventAdmin' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfcontact',
    namespace: '/admin',
    layoutName: 'eventAdmin'
  });

  // set plugin routes
  plugin.setRoutes({
    'get /event/:eventId([0-9]+)/register': {
      name          : 'event_register',
      titleHandler  : 'i18n',
      titleI18n: 'event.register',
      controller    : 'cfregistration',
      action        : 'register',
      model         : 'cfregistration',
      permission    : 'find_event'
    },
    'post /event/:eventId([0-9]+)/register': {
      titleHandler  : 'i18n',
      titleI18n: 'event.register',
      controller    : 'cfregistration',
      action        : 'register',
      model         : 'cfregistration',
      permission    : 'find_event'
    },

    'get /event/:eventId([0-9]+)/un-register': {
      titleHandler  : 'i18n',
      titleI18n: 'cfregistration.unRegister',
      controller    : 'cfregistration',
      action        : 'unRegister',
      model         : 'cfregistration',
      permission    : 'find_event'
    },
    'post /event/:eventId([0-9]+)/un-register': {
      titleHandler  : 'i18n',
      titleI18n: 'event.register',
      controller    : 'cfregistration',
      action        : 'unRegister',
      model         : 'cfregistration',
      permission    : 'find_event'
    },

    // mark all users registered in event as present
    'post /event/:eventId([0-9]+)/admin/cfregistrationtype/:cfregistrationtypeId([0-9]+)/mark-all-as-present': {
      titleHandler  : 'i18n',
      titleI18n: 'cfregistrationtype.markAllAsPresent',
      controller    : 'cfregistrationtype',
      action        : 'markAllAsPresent',
      model         : 'cfregistrationtype',
      permission    : 'manage_event'
    },
    // mark all users subscribed in cfsession as present
    'post /event/:eventId([0-9]+)/admin/cfsession/:cfsessionId([0-9]+)/mark-all-as-present': {
      titleHandler  : 'i18n',
      titleI18n: 'cfsession.markAllAsPresent',
      controller    : 'cfsession',
      action        : 'markAllAsPresent',
      model         : 'cfsession',
      permission    : 'manage_event'
    },

    // -- event admin
    'get /event/:eventId([0-9]+)/admin': {
      name          : 'event_admin',
      layoutName    : 'eventAdmin',
      controller    : 'event',
      action        : 'adminIndex',
      model         : 'event',
      permission    : 'manage_event',
      template      : 'event/admin/index',
      responseType  : 'html'
    },

    // -- Pages
    'get /event/:eventId([0-9]+)/admin/page': {
      titleHandler  : 'i18n',
      titleI18n     : 'cfpage.managePage',
      layoutName    : 'eventAdmin',
      name          : 'event_findOne.page_manage',
      controller    : 'cfpage',
      action        : 'managePage',
      model         : 'cfpage',
      permission    : 'manage_event',
      template      : 'event/admin/cfpages',
    },
    // registration
    'get /event/:eventId([0-9]+)/admin/cfregistration/:cfregistrationId/accept': {
      layoutName    : 'eventAdmin',
      controller    : 'cfregistration',
      action        : 'accept',
      model         : 'cfregistration',
      permission    : 'manage_event'
    },
    'get /event/:eventId([0-9]+)/admin/cfregistration/export.csv': {
      layoutName    : 'eventAdmin',
      controller    : 'cfregistration',
      action        : 'exportRegistration',
      model         : 'cfregistration',
      permission    : 'manage_event',
      responseType  : 'cvs'
    },
    'get /event/:eventId([0-9]+)/admin/cfregistration/usertags.pdf': {
      layoutName    : 'eventAdmin',
      controller    : 'cfregistration',
      action        : 'exportRegistrationUserTags',
      model         : 'cfregistration',
      permission    : 'manage_event',
      responseType  : 'pdf'
    },
   // -- News
    'get /event/:eventId([0-9]+)/admin/news': {
      layoutName    : 'eventAdmin',
      name          : 'event_findOne.news_manage',
      titleHandler  : 'i18n',
      titleI18n     : 'cfnews.managePage',
      controller    : 'cfnews',
      action        : 'managePage',
      model         : 'cfnews',
      permission    : 'manage_event',
      template      : 'event/admin/cfnews',
    },
    // -- Menu

    'get /event/:eventId([0-9]+)/admin/menu': {
      name          : 'event_admin_menu',
      layoutName    : 'eventAdmin',
      controller    : 'cfmenu',
      action        : 'managePage',
      model         : 'cfmenu',
      permission    : 'manage_event',
      template      : 'event/admin/cfmenus',
      responseType  : 'html'
    },
    'get /event/:eventId([0-9]+)/admin/menu/:cfmenuId([0-9]+)': {
      name          : 'event_admin_menu',
      layoutName    : 'eventAdmin',
      controller    : 'cfmenu',
      action        : 'edit',
      model         : 'cfmenu',
      permission    : 'manage_event',
      responseType  : 'html'
    },
    'post /event/:eventId([0-9]+)/admin/menu/:cfmenuId([0-9]+)': {
      name          : 'event_admin_menu',
      layoutName    : 'eventAdmin',
      controller    : 'cfmenu',
      action        : 'edit',
      model         : 'cfmenu',
      permission    : 'manage_event',
      responseType  : 'html'
    },
    // add link
    'get /event/:eventId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/add-link': {
      titleHandler  : 'i18n',
      titleI18n     : 'cflink.create',
      layoutName    : 'eventAdmin',
      controller    : 'cflink',
      action        : 'create',
      model         : 'cflink',
      permission    : 'manage_event',
      responseType  : 'html'
    },
    'post /event/:eventId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/add-link': {
      titleHandler  : 'i18n',
      titleI18n     : 'cflink.create',
      layoutName    : 'eventAdmin',
      controller    : 'cflink',
      action        : 'create',
      model         : 'cflink',
      permission    : 'manage_event',
      responseType  : 'html'
    },
    'post /event/:eventId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/sort-links': {
      layoutName    : 'eventAdmin',
      controller    : 'cflink',
      action        : 'sortLinks',
      model         : 'cflink',
      permission    : 'manage_event',
      responseType  : 'json'
    },

    'get /event/:eventId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/link/:cflinkId([0-9]+)': {
      layoutName    : 'eventAdmin',
      controller    : 'cflink',
      action        : 'edit',
      model         : 'cflink',
      permission    : 'manage_event',
      responseType  : 'html'
    },
    'post /event/:eventId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/link/:cflinkId([0-9]+)': {
      layoutName    : 'eventAdmin',
      controller    : 'cflink',
      action        : 'edit',
      model         : 'cflink',
      permission    : 'manage_event',
      responseType  : 'html'
    },
    'get /event/:eventId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/link/:cflinkId([0-9]+)/delete': {
      layoutName    : 'eventAdmin',
      controller    : 'cflink',
      action        : 'delete',
      model         : 'cflink',
      permission    : 'manage_event',
      responseType  : 'html'
    },
    'post /event/:eventId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/link/:cflinkId([0-9]+)/delete': {
      layoutName    : 'eventAdmin',
      controller    : 'cflink',
      action        : 'delete',
      model         : 'cflink',
      permission    : 'manage_event',
      responseType  : 'html'
    },
    // - create
    'get /event/:eventId([0-9]+)/admin/menu/create': {
      titleHandler  : 'i18n',
      titleI18n     : 'cfmenu.create',
      layoutName    : 'eventAdmin',
      controller    : 'cfmenu',
      action        : 'create',
      model         : 'cfmenu',
      permission    : 'manage_event'
    },
    'post /event/:eventId([0-9]+)/admin/menu/create': {
      titleHandler  : 'i18n',
      titleI18n     : 'cfmenu.create',
      layoutName    : 'eventAdmin',
      controller    : 'cfmenu',
      action        : 'create',
      model         : 'cfmenu',
      permission    : 'manage_event'
    },

    // -- Rooms
    'get /event/:eventId([0-9]+)/admin/room': {
      titleHandler  : 'i18n',
      titleI18n     : 'cfroom.managePage',
      layoutName    : 'eventAdmin',
      controller    : 'cfroom',
      action        : 'find',
      model         : 'cfroom',
      permission    : 'manage_event'
    },

    // - cftopics
    'get /event/:eventId([0-9]+)/admin/topic': {
      layoutName    : 'eventAdmin',
      titleHandler  : 'i18n',
      titleI18n     : 'cftopic.managePage',
      controller    : 'cftopic',
      action        : 'managePage',
      model         : 'cftopic',
      permission    : 'manage_event',
      template      : 'event/admin/cftopics',
    },

    // - cfsession
    'get /event/:eventId([0-9]+)/admin/cfsession/:cfsessionId([0-9]+)/subscribers': {
      layoutName    : 'eventAdmin',
      controller    : 'cfsession',
      action        : 'subscribers',
      model         : 'cfsession',
      permission    : 'manage_event'
    },
   'get /event/:eventId([0-9]+)/admin/cfsession/:cfsessionId([0-9]+)/subscribers.csv': {
      controller    : 'cfsession',
      action        : 'exportSubscribers',
      model         : 'cfsession',
      permission    : 'manage_event',
      responseType  : 'cvs'
    },

    'post /event/:eventId([0-9]+)/subscribe-in-session': {
      controller    : 'cfsession',
      action        : 'addRegistration',
      model         : 'cfsession',
      permission    : 'find_event',
      responseType  : 'html'
    },

    'post /event/:eventId([0-9]+)/unsubscribe-from-session': {
      controller    : 'cfsession',
      action        : 'removeRegistration',
      model         : 'cfsession',
      permission    : 'find_event',
      responseType  : 'html'
    },

    // - cfcontact
    'get /event/:eventId([0-9]+)/contact': {
      name          : 'event_contact',
      titleHandler  : 'i18n',
      titleI18n     : 'event.contact',
      controller    : 'cfcontact',
      action        : 'create',
      model         : 'cfcontact',
      permission    : 'find_event'
    },
    'post /event/:eventId([0-9]+)/contact': {
      titleHandler  : 'i18n',
      titleI18n     : 'event.contact',
      controller    : 'cfcontact',
      action        : 'create',
      model         : 'cfcontact',
      permission    : 'find_event'
    },

    'get /event/:eventId([0-9]+)/admin/managers': {
      titleHandler  : 'i18n',
      titleI18n     : 'event.setManagers',
      controller    : 'event',
      action        : 'setManagers',
      model         : 'event',
      permission    : 'manage_event',
      layoutName    : 'eventAdmin',
      template      : 'event/admin/managers'
    },
    'post /event/:eventId([0-9]+)/admin/managers': {
      titleHandler  : 'i18n',
      titleI18n     : 'event.setManagers',
      controller    : 'event',
      action        : 'setManagers',
      model         : 'event',
      permission    : 'manage_event',
      layoutName    : 'eventAdmin',
      template      : 'event/admin/managers'
    },
    'get /event/:eventId([0-9]+)/location': {
      titleHandler  : 'i18n',
      titleI18n     : 'event.location',
      controller    : 'event',
      action        : 'location',
      model         : 'event',
      permission    : 'find_event',
      template      : 'event/location'
    },

  });

  // use we:after:load:plugins for set default event theme
  plugin.events.on('we:after:load:plugins', function (we) {
    if (
      !we.config.event.defaultTheme &&
      ( we.config.themes && we.config.themes.app )
    ) {
      we.config.event.defaultTheme = we.config.themes.app;
    }
  });

  plugin.hooks.on('we:router:request:before:load:context', function (data, done) {
    var we = data.req.we;
    // set event id in all requests if singleConferenceId is set
    if (we.config.event.singleConferenceId)
      data.req.params.eventId =  we.config.event.singleConferenceId;
    // skip if not are inside one event
    if (!data.req.params.eventId) return done();
    // load event context
    loadConferenceAndConferenceContext(data.req, data.res, done, data.req.params.eventId);
  });

  //{
        //   req: req, res: res
        // }
  plugin.hooks.on('we:router:request:after:load:context', function (data, done) {
    if(!data.res.locals.event) return done();

    if (
      data.res.locals.action == 'find' &&
      data.req.we.config.event.models.indexOf(data.res.locals.model) > -1
    ) {
      data.res.locals.query.where.eventId =  data.res.locals.event.id;
    }

    done();
  });

  plugin.hooks.on('we:request:acl:after:load:context', function (data, done) {
    var we = data.req.we;
    // set admin menu
    if (
      data.res.locals.event &&
      we.acl.canStatic('manage_event', data.req.userRoleNames)
    ) {
      data.res.locals.userMenu.addLink({
        id: 'event_admin',
        dividerAfter: true,
        text: '<i class="glyphicon glyphicon-cog"></i> '+
          data.req.__('event.menu.admin'),
        href: we.router.urlTo(
          'event_admin', [data.res.locals.event.id], we
        ),
        parent: 'user',
        class: null,
        weight: 5
      });
    }

    done();
  });

  // event loader
  function loadConferenceAndConferenceContext(req, res, next, id) {
    // skip in admin pages
    if (res.locals.isAdmin) return next();

    var we = req.we;
    we.db.models.event.findOne({
      where: { id: id }, include: { all: true }
    }).then(function (cf) {
      if (!cf) return res.notFound();
      res.locals.title = cf.title;
      res.locals.event = cf;
      res.locals.widgetContext = 'event-' + res.locals.event.id;

      if (req.body) req.body.eventId = cf.id;

      res.locals.eventService = ( we.config.event.service || 'event' );

      if (cf.theme) {
        res.locals.theme = cf.theme;
      } else {
        res.locals.theme = we.config.event.defaultTheme;
      }

      // chage html to event html
      res.locals.htmlTemplate = 'event/html';
      // set registration count metadata
      res.locals.metadata.cfRegistrationCount = cf.registrationCount;

      we.utils.async.parallel([
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
            where: { eventId: id, userId: req.user.id }
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
              req.userRoleNames.push('eventManager');
            }
            cb();
          });
        },
        function cfcontactCount(cb) {
          we.db.models.cfcontact.count({
            where: { eventId: id }
          }).then(function (count) {
            res.locals.metadata.cfcontactCount = count;
            cb();
          }).catch(cb);
        }
      ], next);
    });
  }

  plugin.addCss('we-plugin-event', {
    type: 'plugin', weight: 10, pluginName: 'we-plugin-event',
    path: 'files/public/we-plugin-event.css'
  });

  return plugin;
};
