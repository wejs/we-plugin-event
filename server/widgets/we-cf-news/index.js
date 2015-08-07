module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-news', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    if (!widget.configuration.nid) return next();
    var we = req.getWe();
    we.db.models.cfnews.findOne({
      where: { id: widget.configuration.nid }
    }).then(function (r) {
      if (!r) return next();
      widget.record = r;
      return next();
    }).catch(next);
  }

  widget.afterSave = function widgetAfterSave(req, res, next) {
    req.body.configuration = {
      nid: req.body.nid
    };
    return next();
  };

  return widget;
};