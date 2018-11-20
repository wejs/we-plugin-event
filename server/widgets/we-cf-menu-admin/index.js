/**
 * Widget we-cf-menu-admin main file
 *
 * See https://github.com/wejs/we-core/blob/master/lib/class/Widget.js for all Widget prototype functions
 */
const eventModule = require('../../../lib');
const widgetUtils = require('../../../lib/widgetUtils');

module.exports = function weCfMenuAdminWidget(projectPath, Widget) {
  const widget = new Widget('we-cf-menu-admin', __dirname);

  widget.checkIfIsValidContext = widgetUtils.checkIfIsValidContext;
  widget.isAvaibleForSelection = widgetUtils.isAvaibleForSelection;
  widget.beforeSave = widgetUtils.beforeSave;
  widget.renderVisibilityField = widgetUtils.renderVisibilityField;

  widget.viewMiddleware = function (w, req, res, next) {
    w.eventId = eventModule.getEventIdFromWidget(w, res);

    if (!w.eventId) return next();

    w.menu = new req.we.class.Menu({
      class: 'nav nav-pills nav-stacked'
    });

    // Then add links:
    w.menu.addLinks([
      {
        id: 'event_admin',
        text: '<span class="fa fa-tachometer"></span> '+req.__('event_admin'),
        href: '/event/'+w.eventId+'/admin',
        weight: 1,
        name: 'event_admin'
      },
      {
        id: 'event_admin_edit',
        text: '<span class="fa fa-pencil-square-o"></span> '+req.__('event_admin_edit'),
        href: '/event/'+w.eventId+'/edit?redirectTo='+req.url,
        weight: 3,
        name: 'event_admin_edit'
      },
      {
        id: 'event_admin_registration',
        text: '<span class="fa fa-user-plus"></span> '+req.__('event_admin_registration'),
        href: '/event/'+w.eventId+'/admin/cfregistration',
        weight: 5,
        name: 'event_admin_registration'
      },
      {
        id: 'cfregistrationtype.find',
        text: '<span class="fa fa-user-plus"></span> '+req.__('cfregistrationtype.find'),
        href: '/event/'+w.eventId+'/admin/cfregistrationtype',
        weight: 7,
        name: 'cfregistrationtype.find'
      },
      {
        id: 'event_admin_menu',
        text: '<span class="fa fa-sitemap"></span> '+req.__('event_admin_menu'),
        href: '/event/'+w.eventId+'/admin/cfmenu',
        weight: 9,
        name: 'event_admin_menu'
      },
      {
        id: 'event_findOne.page_manage',
        text: '<span class="fa fa-files-o"></span> '+req.__('event_findOne.page_manage'),
        href: '/event/'+w.eventId+'/admin/page',
        weight: 11,
        name: 'event_findOne.page_manage'
      },
      {
        id: 'event.managers',
        text: '<span class="fa fa-user-md"></span> '+req.__('event.managers'),
        href: '/event/'+w.eventId+'/admin/managers',
        weight: 13,
        name: 'event.managers'
      }
    ]);

    // allows to extent or change the admin menu
    req.we.hooks.trigger('we-plugin-event:widget:we-cf-menu-admin', widget, next);
  }

  return widget;
};