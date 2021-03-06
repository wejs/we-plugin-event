/**
 * Event routes and breadcrumbs
 */
module.exports = function setRoutesAndResources(plugin) {
  plugin.setResource({
    name: 'event',
    findAll: {
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
    findAll: { breadcrumbHandler: 'cfspeakerFind' },
    findOne: { breadcrumbHandler: 'cfspeakerFindOne' },
    edit: { layoutName: 'eventAdmin',  breadcrumbHandler: 'adminCFSpeakerFindOne' },
    create: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCFSpeakerCreate' },
    delete: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCFSpeakerFindOne' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cftopic',
    findAll: { breadcrumbHandler: 'cftopicFind' },
    findOne: { breadcrumbHandler: 'cftopicFindOne' },
    edit: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCftopicFindOne' },
    create: { layoutName: 'eventAdmin',  breadcrumbHandler: 'adminCftopicCreate' },
    delete: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCftopicFindOne' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfmenu',
    namespace: '/admin',
    layoutName: 'eventAdmin',
    create: { breadcrumbHandler: 'adminCfMenuFindCreate' },
    findOne: { breadcrumbHandler: 'adminCfMenuFindOne' },
    edit: { breadcrumbHandler: 'adminCfMenuFindOne' },
    delete: { breadcrumbHandler: 'adminCfMenuFindOne' },
    findAll: { breadcrumbHandler: 'adminCfMenuFind' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfpage',
    findAll: { breadcrumbHandler: 'cfPageFind' },
    findOne: { breadcrumbHandler: 'cfPageFindOne' },
    edit: { layoutName: 'eventAdmin', breadcrumbHandler: 'cfPageFindOne' },
    create: { layoutName: 'eventAdmin', breadcrumbHandler: 'cfPageCreate'  },
    delete: { layoutName: 'eventAdmin', breadcrumbHandler: 'cfPageFindOne'  }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfnews',
    findAll: { breadcrumbHandler: 'cfnewsFindAll' },
    findOne: { breadcrumbHandler: 'cfnewsFindOne' },
    edit: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCfnewsFindOne' },
    create: { layoutName: 'eventAdmin', breadcrumbHandler: 'cfnewsCreate' },
    delete: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCfnewsFindOne' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfregistration',
    namespace: '/admin',
    layoutName: 'eventAdmin',
    create: { breadcrumbHandler: 'adminCfregistrationCreate' },
    findOne: { breadcrumbHandler: 'adminCfregistrationFindOne' },
    edit: { breadcrumbHandler: 'adminCfregistrationFindOne' },
    delete: { breadcrumbHandler: 'adminCfregistrationFindOne' },
    findAll: {
      breadcrumbHandler: 'adminCfregistrationFindAll',
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
            field: 'displayName',
            required: true
          }
        }
      }
    }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfregistrationtype',
    namespace: '/admin',
    layoutName: 'eventAdmin',
    create: { breadcrumbHandler: 'admincfregistrationtypeCreate' },
    findOne: { breadcrumbHandler: 'admincfregistrationtypeFindOne' },
    edit: { breadcrumbHandler: 'admincfregistrationtypeFindOne' },
    delete: { breadcrumbHandler: 'admincfregistrationtypeFindOne' },
    findAll: { breadcrumbHandler: 'admincfregistrationtypeFind' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfroom',
    findAll: { breadcrumbHandler: 'cfroomFind' },
    findOne: { breadcrumbHandler: 'cfroomFindOne' },
    edit: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCfroomFindOne' },
    create: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCfroomCreate' },
    delete: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCfroomFindOne' }
  });
  // sessions resource routes
  plugin.setResource({
    parent: 'event',
    name: 'cfsession',
    namespace: '/admin',
    layoutName: 'eventAdmin',
    findAll: { breadcrumbHandler: 'adminCfSessionFind' },
    findOne: { breadcrumbHandler: 'adminCfSessionFindOne' },
    edit: { breadcrumbHandler: 'adminCfSessionFindOne'},
    delete: { breadcrumbHandler: 'adminCfSessionFindOne'},
    create: { breadcrumbHandler: 'adminCfSessionCreate'},

  });
  // user sessions
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
    findAll: { breadcrumbHandler: 'CFPartnerFind' },
    findOne: { breadcrumbHandler: 'CFPartnerFindOne' },
    edit: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCFPartnerFindOne' },
    create: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCFPartnerCreate' },
    delete: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCFPartnerFindOne' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfvideo',
    findAll: { breadcrumbHandler: 'CFVideoFind' },
    findOne: { breadcrumbHandler: 'CFVideoFindOne' },
    edit: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCFVideoFindOne' },
    create: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCFVideoCreate' },
    delete: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCFVideoFindOne' }
  });
  plugin.setResource({
    parent: 'event',
    name: 'cfcontact',
    namespace: '/admin',
    layoutName: 'eventAdmin',
    findAll: { breadcrumbHandler: 'adminCFContactFind' },
    findOne: { breadcrumbHandler: 'adminCFContactFindOne' },
    edit: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCFContactFindOne' },
    create: { layoutName: 'eventAdmin', breadcrumbHandler: 'createCFContact' },
    delete: { layoutName: 'eventAdmin', breadcrumbHandler: 'adminCFContactFindOne' }
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
    'post /event/:eventId([0-9]+)/admin/cfregistration/mark-all-as-present': {
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
      responseType  : 'html',
      breadcrumbHandler: 'eventAdmin'
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
      breadcrumbHandler: 'adminCfPageFind'
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
      responseType  : 'csv'
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
      breadcrumbHandler: 'adminCfnewsFind'
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
      name          : 'cflink.edit',
      layoutName    : 'eventAdmin',
      controller    : 'cflink',
      action        : 'edit',
      model         : 'cflink',
      paramIdName   : 'cflinkId',
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
      paramIdName   : 'cflinkId',
      permission    : 'manage_event',
      responseType  : 'html'
    },
    'get /event/:eventId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/link/:cflinkId([0-9]+)/delete': {
      layoutName    : 'eventAdmin',
      controller    : 'cflink',
      action        : 'delete',
      model         : 'cflink',
      paramIdName   : 'cflinkId',
      permission    : 'manage_event',
      responseType  : 'html'
    },
    'post /event/:eventId([0-9]+)/admin/menu/:cfmenuId([0-9]+)/link/:cflinkId([0-9]+)/delete': {
      layoutName    : 'eventAdmin',
      controller    : 'cflink',
      action        : 'delete',
      model         : 'cflink',
      paramIdName   : 'cflinkId',
      permission    : 'manage_event',
      responseType  : 'html'
    },

    // -- Rooms
    'get /event/:eventId([0-9]+)/admin/room': {
      titleHandler  : 'i18n',
      titleI18n     : 'cfroom.managePage',
      layoutName    : 'eventAdmin',
      controller    : 'cfroom',
      action        : 'find',
      model         : 'cfroom',
      permission    : 'manage_event',
      breadcrumbHandler: 'adminCfroomFind'
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
      breadcrumbHandler: 'adminCftopicFind'
    },

    // - cfvideo
    'get /event/:eventId([0-9]+)/admin/video': {
      layoutName    : 'eventAdmin',
      titleHandler  : 'i18n',
      titleI18n     : 'cfvideo.find',
      controller    : 'cfvideo',
      action        : 'find',
      model         : 'cfvideo',
      permission    : 'manage_event',
      template      : 'event/admin/cfvideos',
      breadcrumbHandler: 'adminCFVideoFind'
    },

    // - cfsession
    'get /event/:eventId([0-9]+)/admin/cfsession/:cfsessionId([0-9]+)/subscribers': {
      layoutName    : 'eventAdmin',
      controller    : 'cfsession',
      action        : 'subscribers',
      model         : 'cfsession',
      permission    : 'manage_event'
    },
   'get /event/:eventId([0-9]+)/admin/cfsession/:cfsessionId([0-9]+)/subscribers-export': {
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

    // - speakers
    'get /event/:eventId([0-9]+)/admin/speaker': {
      layoutName    : 'eventAdmin',
      titleHandler  : 'i18n',
      titleI18n     : 'cfspeaker.find',
      controller    : 'cfspeaker',
      action        : 'find',
      model         : 'cfspeaker',
      permission    : 'manage_event',
      template      : 'event/admin/cfspeakers',
      breadcrumbHandler: 'adminCFSpeakersFind'
    },
    // - partner
    'get /event/:eventId([0-9]+)/admin/partner': {
      layoutName    : 'eventAdmin',
      titleHandler  : 'i18n',
      titleI18n     : 'cfpartner.find',
      controller    : 'cfpartner',
      action        : 'find',
      model         : 'cfpartner',
      permission    : 'manage_event',
      template      : 'event/admin/cfpartners',
      breadcrumbHandler: 'adminCFPartnerFind'
    },
    // - cfcontact
    'get /event/:eventId([0-9]+)/contact': {
      name          : 'event_contact',
      titleHandler  : 'i18n',
      titleI18n     : 'event.contact',
      controller    : 'cfcontact',
      action        : 'create',
      model         : 'cfcontact',
      permission    : 'find_event',
      breadcrumbHandler: 'createCFContact'
    },
    'post /event/:eventId([0-9]+)/contact': {
      titleHandler  : 'i18n',
      titleI18n     : 'event.contact',
      controller    : 'cfcontact',
      action        : 'create',
      model         : 'cfcontact',
      permission    : 'find_event',
      breadcrumbHandler: 'createCFContact'
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
    },
    'get /event/:eventId([0-9]+)/location': {
      titleHandler  : 'i18n',
      titleI18n     : 'event.location',
      controller    : 'event',
      action        : 'location',
      model         : 'event',
      permission    : 'find_event',
      template      : 'event/location'
    }
  });
}