/**
 * Event routes and breadcrumbs
 */
module.exports = function setRoutesAndResources(plugin) {

  plugin.setResource({
    name: 'cfmenu',
    namespace: '/event/:eventId/admin',
    layoutName: 'eventAdmin',
    create: { breadcrumbHandler: 'adminCfMenuFindCreate' },
    findOne: { breadcrumbHandler: 'adminCfMenuFindOne' },
    edit: { breadcrumbHandler: 'adminCfMenuFindOne' },
    delete: { breadcrumbHandler: 'adminCfMenuFindOne' },
    findAll: { breadcrumbHandler: 'adminCfMenuFind' }
  });

  // set plugin routes
  plugin.setRoutes({
    'get /event': {
      name: 'event.find',
      controller: 'event',
      action: 'find',
      model: 'event',
      permission: 'find_event',
      titleHandler : 'i18n',
      titleI18n: 'event.find',
      template: 'event/find',
      eventSearch: true,
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
    // -- event admin
    'get /event/:eventId([0-9]+)/admin': {
      name          : 'event_admin',
      layoutName    : 'eventAdmin',
      controller    : 'event',
      action        : 'adminIndex',
      model         : 'event',
      permission    : 'manage_event',
      template      : 'event/admin/index',
      responseType  : 'html',
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
      breadcrumbHandler: 'eventAdmin'
    },

    // -- Menu

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
      titleHandler: 'recordField',
      titleField: 'text',
      layoutName    : 'eventAdmin',
      controller    : 'cflink',
      action        : 'edit',
      model         : 'cflink',
      permission    : 'manage_event',
      responseType  : 'html'
    },
    'post /event/:eventId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/link/:cflinkId([0-9]+)': {
      titleHandler: 'recordField',
      titleField: 'text',
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