/**
 * Widget we-cf-menu-content main file
 *
 * See https://github.com/wejs/we-core/blob/master/lib/class/Widget.js for all Widget prototype functions
 */

module.exports = function weCfMenuContentWidget(projectPath, Widget) {
  var widget = new Widget('we-cf-menu-content', __dirname);
  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    if (!res.locals.event) return next();
    widget.cfid = res.locals.event.id
    next();
  }
  return widget;
};