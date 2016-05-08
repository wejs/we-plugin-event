/**
 * We.js we-plugin-event plugin settings
 */

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);

  // breadcrumb middlewares
  plugin.setBreadcrumbs = require('./lib/setBreadcrumbs.js');
  plugin.setRoutesAndResources = require('./lib/setRoutesAndResources.js');

  // set plugin configs
  plugin.setConfigs({
    event: {
      // add main menu create btn
      mainMenuCreateBTN: true,
      // add a event id for load in all event portal as a single event portal
      singleConferenceId: false,
      // a list of theme names avaible to events
      themes: [],
      // set default theme here, if is null the system will load the portal theme
      defaultTheme: null,
      models: [
        'event',
        'cflink',
        'cfmenu'
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
        name: 'eventManager',
        isSystemRole: true,
        permissions: [
          'find_event',
          'create_event',
          'update_event',
          'delete_event',
          'manage_event'
        ]
      }
    },
    forms: {
      'event-about': __dirname + '/server/forms/event-about.json',
      'event-dates': __dirname + '/server/forms/event-dates.json',
      'event-emails': __dirname + '/server/forms/event-emails.json',
      'event-publish': __dirname + '/server/forms/event-publish.json',
      'event-theme': __dirname + '/server/forms/event-theme.json',
      'event-messages': __dirname + '/server/forms/event-messages.json',
      'event-managers-add': __dirname + '/server/forms/event-managers-add.json'
    }
  });

  // set breadcrumb middlewares after routes
  plugin.setBreadcrumbs(plugin);
  // set routes and resources
  plugin.setRoutesAndResources(plugin);

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


  plugin.hooks.on('we:router:request:after:load:context', function (data, done) {
    if(!data.res.locals.event) return done();
    // add event filter for events contents
    if (
      data.res.locals.action == 'find' &&
      data.req.we.config.event.models.indexOf(data.res.locals.model) > -1
    ) {
      data.res.locals.query.where.eventId =  data.res.locals.event.id;
    }

    done();
  });

  plugin.hooks.on('we-plugin-menu:after:set:core:menus', function (data, done) {
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
    // only show create event btn if are outside one event
    if (!data.res.locals.event && !data.res.locals.isAdmin) {
      if (we.config.event.mainMenuCreateBTN && data.req.isAuthenticated()) {
        data.res.locals.userMenu.addLink({
          id: 'create_event',
          text: data.req.__('event.create'),
          href: we.router.urlTo( 'event.create', [], we ),
          class: 'btn btn-primary btn-main-menu-create-event',
          weight: 5
        });
      } else {
        data.res.locals.userMenu.addLink({
          id: 'create_event',
          text: data.req.__('event.create'),
          href: '/login?redirectTo=/event/create',
          class: 'btn btn-primary btn-main-menu-create-event',
          weight: 5
        });
      }
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
        }
      ], next);
    });
  }

  plugin.addJs('we-plugin-event', {
    type: 'plugin', weight: 10, pluginName: 'we-plugin-event',
    path: 'files/public/we-plugin-event.js'
  });

  plugin.addCss('we-plugin-event', {
    type: 'plugin', weight: 10, pluginName: 'we-plugin-event',
    path: 'files/public/we-plugin-event.css'
  });

  return plugin;
};
