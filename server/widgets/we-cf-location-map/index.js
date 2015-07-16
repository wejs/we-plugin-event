module.exports = function weCfMenuWidget(projectPath, Widget) {
  var widget = new Widget('we-cf-location-map', __dirname);

  // widget.afterSave = function afterSave(req, res, next) {
  //   if (!req.body.configuration) req.body.configuration = {};
  //   req.body.configuration.menu = req.body.menu;
  //   return next();
  // };

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    var we = req.getWe();
    widget.API_KEY = we.config.apiKeys.googleMaps;
    next();
  }

  return widget;
};