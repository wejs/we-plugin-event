/**
 * Widget we-cf-menu-content main file
 *
 * See https://github.com/wejs/we-core/blob/master/lib/class/Widget.js for all Widget prototype functions
 */

var eventModule = require('../../../lib');
var widgetUtils = require('../../../lib/widgetUtils');

module.exports = function weCfMenuContentWidget(projectPath, Widget) {
  var widget = new Widget('we-cf-menu-content', __dirname);

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
        id: 'cftopic.managePage',
        text: '<span class="fa fa-tags"></span> '+req.__('cftopic.managePage'),
        href: '/event/'+widget.eventId+'/admin/topic',
        weight: 1,
        name: 'cftopic.managePage'
      },
      {
        id: 'event_findOne.news_manage',
        text: '<span class="fa fa-rss"></span> '+req.__('event_findOne.news_manage'),
        href: '/event/'+widget.eventId+'/admin/news',
        weight: 3,
        name: 'event_findOne.news_manage'
      },
      {
        id: 'event_findOne.room_manage',
        text: '<span class="fa fa-tasks"></span> '+req.__('event_findOne.room_manage'),
        href: '/event/'+widget.eventId+'/admin/room',
        weight: 5,
        name: 'event_findOne.room_manage'
      },
      {
        id: 'event.cfsession',
        text: '<span class="fa fa-users"></span> '+req.__('event.cfsession'),
        href: '/event/'+widget.eventId+'/admin/cfsession',
        weight: 7,
        name: 'event.cfsession'
      },
      {
        id: 'event.cfspeaker',
        text: '<span class="fa fa-microphone"></span> '+req.__('event.cfspeaker'),
        href: '/event/'+widget.eventId+'/admin/speaker',
        weight: 9,
        name: 'event.cfspeaker'
      },
      {
        id: 'cfpartner.find',
        text: '<span class="fa fa-usd"></span> '+req.__('cfpartner.find'),
        href: '/event/'+widget.eventId+'/admin/partner',
        weight: 11,
        name: 'cfpartner.find'
      },
      {
        id: 'cfvideo.find',
        text: '<span class="fa fa-video-camera"></span> '+req.__('cfvideo.find'),
        href: '/event/'+widget.eventId+'/admin/video',
        weight: 13,
        name: 'cfvideo.find'
      },
      {
        id: 'event.contact',
        text: '<span class="fa fa-life-ring"></span> '+req.__('event.contact'),
        href: '/event/'+widget.eventId+'/admin/cfcontact',
        weight: 15,
        name: 'event.contact'
      },
    ]);

    // allows to extent or change the content menu
    req.we.hooks.trigger('we-plugin-event:widget:we-cf-menu-content', {
      widget: widget,
      req: req,
      res: res
    }, next);
  }
  return widget;
};