module.exports = function cfVideoWidget(projectPath, Widget) {
  var widget = new Widget('we-cf-video', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    if (!widget.configuration.vid) return next();
    var we = req.getWe();
    we.db.models.cfvideo.findOne({
      where: { id: widget.configuration.vid }
    }).then(function (r) {
      if (!r) return next();
      widget.cfvideo = r;
      return next();
    }).catch(next);
  }

  widget.afterSave = function widgetAfterSave(req, res, next) {
    if (!req.body.configuration) {
      req.body.configuration = {};
    }
    req.body.configuration.vid = req.body.vid;
    return next();
  };

  return widget;
};