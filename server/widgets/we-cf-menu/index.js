module.exports = function weCfMenuWidget(projectPath, Widget) {
  var widget = new Widget('we-cf-menu', __dirname);

  widget.afterSave = function afterSave(req, res, next) {
    if (!req.body.configuration) req.body.configuration = {};
    req.body.configuration.menu = req.body.menu;
    return next();
  };

  widget.formMiddleware = function formMiddleware(req, res, next) {
    var we = req.getWe();
    res.locals.menu = we.config.menu;
    next();
  }

  return widget;
};