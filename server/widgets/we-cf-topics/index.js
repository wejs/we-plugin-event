module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-topics', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    if (!res.locals.conference) return next();
    widget.topics = res.locals.conference.topics;
    next();
  }

  return widget;
};