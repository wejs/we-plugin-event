/**
 * Widget we-cf-menu-admin main file
 *
 * See https://github.com/wejs/we-core/blob/master/lib/class/Widget.js for all Widget prototype functions
 */
var eventModule = require('../../../lib');
var widgetUtils = require('../../../lib/widgetUtils');

module.exports = function weCfMenuAdminWidget(projectPath, Widget) {
  var widget = new Widget('we-cf-menu-admin', __dirname);

  widget.checkIfIsValidContext = widgetUtils.checkIfIsValidContext;
  widget.isAvaibleForSelection = widgetUtils.isAvaibleForSelection;
  widget.beforeSave = widgetUtils.beforeSave;
  widget.renderVisibilityField = widgetUtils.renderVisibilityField;

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    widget.eventId = eventModule.getEventIdFromWidget(widget, res);

    if (!widget.eventId) return next();

    widget.menu = new req.we.class.Menu({
      class: 'nav nav-pills nav-stacked'
    });

    // Then add links:
    widget.menu.addLinks([
      {
        id: 'event_admin',
        text: '<span class="fa fa-tachometer"></span> '+req.__('event_admin'),
        href: '/event/'+widget.eventId+'/admin',
        weight: 1,
        name: 'event_admin'
      },
      {
        id: 'event_admin_edit',
        text: '<span class="fa fa-pencil-square-o"></span> '+req.__('event_admin_edit'),
        href: '/event/'+widget.eventId+'/edit?redirectTo='+req.url,
        weight: 3,
        name: 'event_admin_edit'
      },
      {
        id: 'cfregistrationtype.find',
        text: '<span class="fa fa-ticket"></span> '+req.__('event.edit.step.registrationTypes'),
        href: '/event/'+widget.eventId+'/edit?step=4',
        weight: 5,
        name: 'cfregistrationtype.find'
      },
      {
        id: 'event_admin_registration',
        text: '<span class="fa fa-user-plus"></span> '+req.__('event_admin_registration'),
        href: '/event/'+widget.eventId+'/admin/cfregistration',
        weight: 7,
        name: 'event_admin_registration'
      },
      {
        id: 'event_admin_menu',
        text: '<span class="fa fa-sitemap"></span> '+req.__('event_admin_menu'),
        href: '/event/'+widget.eventId+'/admin/cfmenu',
        weight: 9,
        name: 'event_admin_menu'
      },
      {
        id: 'event_findOne.page_manage',
        text: '<span class="fa fa-files-o"></span> '+req.__('event_findOne.page_manage'),
        href: '/event/'+widget.eventId+'/admin/page',
        weight: 11,
        name: 'event_findOne.page_manage'
      },
      {
        id: 'event.managers',
        text: '<span class="fa fa-user-md"></span> '+req.__('event.managers'),
        href: '/event/'+widget.eventId+'/admin/managers',
        weight: 13,
        name: 'event.managers'
      }
    ]);

    // allows to extent or change the admin menu
    req.we.hooks.trigger('we-plugin-event:widget:we-cf-menu-admin', widget, next);
  }

  return widget;
};