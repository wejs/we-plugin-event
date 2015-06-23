/**
 * We.js we-plugin-conference plugin settings
 */

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);

  // set plugin configs
  plugin.setConfigs({
    conference: {
      defaultTheme: 'we-theme-conference'
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
      }
    }
  });
  // ser plugin routes
  plugin.setRoutes({
    'get /conference/create': {
      controller    : 'conference',
      action        : 'createPage',
      model         : 'conference',
      permission    : 'create_conference'
    },
    'post /conference/create': {
      controller    : 'conference',
      action        : 'createPage',
      model         : 'conference',
      permission    : 'create_conference'
    },
    // conference CRUD
    'get /conference/:conferenceId([0-9]+)': {
      name          : 'conference_findOne',
      controller    : 'conference',
      action        : 'findOne',
      model         : 'conference',
      permission    : 'find_conference'
    },
    'get /conference': {
      controller    : 'conference',
      action        : 'find',
      model         : 'conference',
      permission    : 'find_conference'
    },

    'put /conference/:id([0-9]+)': {
      controller    : 'conference',
      action        : 'update',
      model         : 'conference',
      permission    : 'update_conference'
    },
    'delete /conference/:id([0-9]+)': {
      controller    : 'conference',
      action        : 'destroy',
      model         : 'conference',
      permission    : 'delete_conference'
    },

    // CONFERENCE ROOM ROUTES
    // 'get /conference/:conferenceId([0-9]+)/room/:id([0-9]+)': {
    //   controller    : 'cfroom',
    //   action        : 'findOne',
    //   model         : 'cfroom',
    //   permission    : 'find_cfroom'
    // },
    // 'get /conference/:conferenceId([0-9]+)/room': {
    //   controller    : 'cfroom',
    //   action        : 'find',
    //   model         : 'cfroom',
    //   permission    : 'find_cfroom'
    // },
    // 'post /conference/:conferenceId([0-9]+)/room': {
    //   controller    : 'cfroom',
    //   action        : 'create',
    //   model         : 'cfroom',
    //   permission    : 'create_cfroom'
    // },
    // 'put /conference/:conferenceId([0-9]+)/room/:id([0-9]+)': {
    //   controller    : 'cfroom',
    //   action        : 'update',
    //   model         : 'cfroom',
    //   permission    : 'update_cfroom'
    // },
    // 'delete /conference/:conferenceId([0-9]+)/room/:id([0-9]+)': {
    //   controller    : 'cfroom',
    //   action        : 'destroy',
    //   model         : 'cfroom',
    //   permission    : 'delete_cfroom'
    // },

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

    'get /conference/:conferenceId([0-9]+)/admin/edit': {
      name          : 'conference_admin_edit',
      layoutName    : 'conferenceAdmin',
      controller    : 'conference',
      action        : 'editPage',
      model         : 'conference',
      permission    : 'update_conference'
    },
    'post /conference/:conferenceId([0-9]+)/admin/edit': {
      name          : 'conference_admin_edit',
      layoutName    : 'conferenceAdmin',
      controller    : 'conference',
      action        : 'createPage',
      model         : 'editPage',
      permission    : 'update_conference'
    },

    'get /conference/:conferenceId([0-9]+)/admin/menu': {
      name          : 'conference_admin_menu',
      layoutName    : 'conferenceAdmin',
      controller    : 'conference',
      action        : 'adminMenu',
      model         : 'conference',
      permission    : 'manage_conference',
      template      : 'conference/admin/menu',
      responseType  : 'html'
    },
    'get /conference/:conferenceId([0-9]+)/admin/menu/resetAll': {
      name          : 'conference_admin_reset',
      layoutName    : 'conferenceAdmin',
      controller    : 'conference',
      action        : 'resetConferenceMenu',
      model         : 'conference',
      permission    : 'manage_conference',
      responseType  : 'json'
    },
    'get /conference/:conferenceId([0-9]+)/admin/layout': {
      name          : 'conference_admin_layouts',
      layoutName    : 'conferenceAdmin',
      controller    : 'conference',
      action        : 'adminLayouts',
      model         : 'conference',
      permission    : 'manage_conference',
      template      : 'conference/admin/layouts',
      responseType  : 'html'
    },
    'get /conference/:conferenceId([0-9]+)/admin/layout/:name': {
      name          : 'conference_admin_layout',
      layoutName    : 'conferenceAdmin',
      controller    : 'conference',
      action        : 'adminLayout',
      model         : 'conference',
      permission    : 'manage_conference',
      template      : 'conference/admin/layout',
      responseType  : 'html'
    },
    'post /conference/:conferenceId([0-9]+)/admin/widget/create': {
      layoutName    : 'conferenceAdmin',
      controller    : 'conference',
      action        : 'saveWidget',
      model         : 'widget',
      permission    : 'manage_conference',
      responseType  : 'json'
    },
    'post /conference/:conferenceId([0-9]+)/admin/widget/sortWidgets': {
      layoutName    : 'conferenceAdmin',
      controller    : 'conference',
      action        : 'sortWidgets',
      model         : 'widget',
      permission    : 'manage_conference',
      responseType  : 'json'
    },

    // -- Pages
    'get /conference/:conferenceId([0-9]+)/admin/page': {
      layoutName    : 'conferenceAdmin',
      name          : 'conference_findOne.page_manage',
      fieldTitle    : 'title',
      controller    : 'cfpage',
      action        : 'managePage',
      model         : 'cfpage',
      permission    : 'find_conference',
      template      : 'conference/admin/cfpages',
    },
    // - create
    'get /conference/:conferenceId([0-9]+)/admin/page/create': {
      layoutName    : 'conferenceAdmin',
      name          : 'conference_findOne.page_createPage',
      controller    : 'cfpage',
      action        : 'createPage',
      model         : 'cfpage',
      permission    : 'manage_conference'
    },
    'post /conference/:conferenceId([0-9]+)/admin/page/create': {
      layoutName    : 'conferenceAdmin',
      controller    : 'cfpage',
      action        : 'createPage',
      model         : 'cfpage',
      permission    : 'manage_conference'
    },
    // - edit
    'get /conference/:conferenceId([0-9]+)/admin/page/:cfpageId([0-9]+)': {
      layoutName    : 'conferenceAdmin',
      name          : 'conference_findOne.page_editPage',
      fieldTitle    : 'title',
      controller    : 'cfpage',
      action        : 'editPage',
      model         : 'cfpage',
      permission    : 'manage_conference',
      template      : 'cfpage/editPage'
    },
    'post /conference/:conferenceId([0-9]+)/admin/page/:cfpageId([0-9]+)': {
      layoutName    : 'conferenceAdmin',
      fieldTitle    : 'title',
      controller    : 'cfpage',
      action        : 'editPage',
      model         : 'cfpage',
      permission    : 'manage_conference',
      template      : 'cfpage/editPage'
    },

    // user page routes
    'get /conference/:conferenceId([0-9]+)/page': {
      name          : 'conference_findOne.page_find',
      fieldTitle    : 'title',
      controller    : 'cfpage',
      action        : 'find',
      model         : 'cfpage',
      permission    : 'find_conference'
    },
    'get /conference/:conferenceId([0-9]+)/page/:cfpageId([0-9]+)': {
      name          : 'conference_findOne.page_findOne',
      fieldTitle    : 'title',
      controller    : 'cfpage',
      action        : 'findOne',
      model         : 'cfpage',
      permission    : 'find_conference'
    }
  });

  plugin.setHelpers({
    'we-cf-menu': __dirname + '/server/helpers/we-cf-menu.js'
  });
  plugin.setWidgets({
    'we-cf-menu': __dirname + '/server/widgets/we-cf-menu'
  });

  plugin.events.on('we:express:set:params', function(data) {
    var we = data.we;
    // user pre-loader
    data.express.param('conferenceId', function (req, res, next, id) {
      data.we.db.models.conference.findById(id).then(function (cf) {
        if (!cf) return res.notFound();
        res.locals.title = cf.title;
        res.locals.conference = cf;
        res.locals.widgetContext = 'conference-' + res.locals.conference.id;

        if (cf.theme) {
          res.locals.theme = cf.theme;
        } else {
          res.locals.theme = we.config.conference.defaultTheme;
        }
        // chage html to conference html
        res.locals.htmlTemplate = 'conference/html';
        // preload all conference menu
        we.db.models.cfmenu.findAll({ where: { conferenceId: id }})
        .then(function (cfmenus) {
          res.locals.cfmenu = cfmenus;
          next();
        })
      });
    });
  });

  return plugin;
};