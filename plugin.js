/**
 * We.js we-plugin-conference plugin settings
 */

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);

  // set plugin configs
  plugin.setConfigs({
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
    'get /conference/:id([0-9]+)': {
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
    }
  });

  return plugin;
};