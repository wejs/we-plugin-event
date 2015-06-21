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
    'post /conference': {
      controller    : 'conference',
      action        : 'create',
      model         : 'conference',
      permission    : 'create_conference'
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
    'get /conference/:conferenceId([0-9]+)/room/:id([0-9]+)': {
      controller    : 'cfroom',
      action        : 'findOne',
      model         : 'cfroom',
      permission    : 'find_cfroom'
    },
    'get /conference/:conferenceId([0-9]+)/room': {
      controller    : 'cfroom',
      action        : 'find',
      model         : 'cfroom',
      permission    : 'find_cfroom'
    },
    'post /conference/:conferenceId([0-9]+)/room': {
      controller    : 'cfroom',
      action        : 'create',
      model         : 'cfroom',
      permission    : 'create_cfroom'
    },
    'put /conference/:conferenceId([0-9]+)/room/:id([0-9]+)': {
      controller    : 'cfroom',
      action        : 'update',
      model         : 'cfroom',
      permission    : 'update_cfroom'
    },
    'delete /conference/:conferenceId([0-9]+)/room/:id([0-9]+)': {
      controller    : 'cfroom',
      action        : 'destroy',
      model         : 'cfroom',
      permission    : 'delete_cfroom'
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
    }
  });

  plugin.events.on('we:express:set:params', function(data) {
    var we = data.we;
    // user pre-loader
    data.express.param('conferenceId', function (req, res, next, id) {
      data.we.db.models.conference.findById(id).then(function (cf) {
        if (!cf) return res.notFound();
        res.locals.title = cf.title;
        res.locals.conference = cf;
        if (cf.theme) {
          res.locals.theme = cf.theme;
        } else {
          res.locals.theme = we.config.conference.defaultTheme;
        }
        // chage html to conference html
        res.locals.htmlTemplate = 'conference/html';
        // preload all conference menu
        we.db.models.cfmenu.findAll()
        .then(function (cfmenus) {
          res.locals.cfmenu = cfmenus;
          next();
        })
      });
    });
  });

  return plugin;
};