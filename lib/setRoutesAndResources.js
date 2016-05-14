/**
 * Event routes and breadcrumbs
 */
module.exports = function setRoutesAndResources(plugin) {
  // set plugin routes
  plugin.setRoutes({
    'get /event': {
      name: 'event.find',
      resourceName: 'event',
      controller: 'event',
      action: 'find',
      model: 'event',
      permission: 'find_event',
      titleHandler : 'i18n',
      titleI18n: 'event.find',
      template: 'event/find',
      eventSearch: true,
      breadcrumbHandler: 'find',
      search: {
        title:  {
          parser: 'contains',
          target: {
            type: 'field',
            field: 'title'
          }
        }
      }
    },
    'get /event/:eventId': {
      name: 'event.findOne',
      controller: 'event',
      action: 'findOne',
      model: 'event',
      permission: 'find_event',
      titleHandler : 'recordField',
      titleField: 'title',
      template: 'event/findOne',
      layoutName: 'eventHome'
    },

    'get /event/create': {
      resourceName: 'event',
      name: 'event.create',
      action: 'create',
      controller: 'event',
      model: 'event',
      template: 'event/create',
      permission: 'create_event',
      titleHandler: 'i18n',
      titleI18n: 'event.create',
      breadcrumbHandler: 'create'
    },

    'post /event/create': {
      resourceName: 'event',
      action: 'create',
      controller: 'event',
      model: 'event',
      template: 'event/create',
      permission: 'create_event',
      titleHandler: 'i18n',
      titleI18n: 'event.create',
      breadcrumbHandler: 'create'
    },

    // -- event admin
    'get /event/:eventId([0-9]+)/admin': {
      name          : 'event.admin',
      layoutName    : 'eventAdmin',
      controller    : 'event',
      action        : 'adminIndex',
      model         : 'event',
      permission    : 'manage_event',
      template      : 'event/admin/index',
      responseType  : 'html',
      titleHandler : 'i18n',
      titleI18n: 'event.admin',
      breadcrumbHandler: 'eventAdmin'
    },
    // edit event
    'get /event/:eventId([0-9]+)/admin/edit': {
      resourceName: 'event',
      name: 'event.edit',
      layoutName: 'eventAdmin',
      action: 'edit',
      controller: 'event',
      model: 'event',
      template: 'event/edit',
      permission: 'manage_event',
      titleHandler : 'i18n',
      titleI18n: 'event.edit',
      breadcrumbHandler: 'eventAdmin'
    },
    'post /event/:eventId([0-9]+)/admin/edit': {
      resourceName: 'event',
      action: 'edit',
      layoutName: 'eventAdmin',
      controller: 'event',
      model: 'event',
      template: 'event/edit',
      permission: 'manage_event',
      titleHandler : 'i18n',
      titleI18n: 'event.edit',
      breadcrumbHandler: 'eventAdmin'
    },
    // managers
    'get /event/:eventId([0-9]+)/admin/managers': {
      titleHandler  : 'i18n',
      titleI18n     : 'event.setManagers',
      controller    : 'event',
      action        : 'setManagers',
      model         : 'event',
      permission    : 'manage_event',
      layoutName    : 'eventAdmin',
      template      : 'event/admin/managers',
      breadcrumbHandler: 'adminEventManagers'
    },
    'post /event/:eventId([0-9]+)/admin/managers': {
      titleHandler  : 'i18n',
      titleI18n     : 'event.setManagers',
      controller    : 'event',
      action        : 'setManagers',
      model         : 'event',
      permission    : 'manage_event',
      layoutName    : 'eventAdmin',
      template      : 'event/admin/managers',
      breadcrumbHandler: 'adminEventManagers'
    }
  });
}