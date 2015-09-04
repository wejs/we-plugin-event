/**
 * Widget we-cf-menu-admin main file
 *
 * See https://github.com/wejs/we-core/blob/master/lib/class/Widget.js for all Widget prototype functions
 */

module.exports = function weCfMenuAdminWidget(projectPath, Widget) {
  var widget = new Widget('we-cf-menu-admin', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    if (!res.locals.conference) return next();
    widget.cfid = res.locals.conference.id
    next();
  }

  return widget;
};