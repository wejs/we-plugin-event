/**
 * Widget we-cf-menu-content main file
 *
 * See https://github.com/wejs/we-core/blob/master/lib/class/Widget.js for all Widget prototype functions
 */

var eventModule = require('../../../lib');

module.exports = function weCfMenuContentWidget(projectPath, Widget) {
  var widget = new Widget('we-cf-menu-content', __dirname);
  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    widget.cfid = eventModule.getEventIdFromWidget(widget, res);
    next();
  }
  return widget;
};