module.exports = function htmlWidget(projectPath, Widget) {
  var widget = new Widget('we-cf-video-static', __dirname);

  widget.afterSave = function widgetAfterSave(req, res, next) {
    if (!req.body.configuration) {
      req.body.configuration = {};
    }
    req.body.configuration.url = req.body.url;
    return next();
  };

  return widget;
};