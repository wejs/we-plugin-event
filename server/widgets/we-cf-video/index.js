var eventModule = require('../../../lib');

module.exports = function cfVideoWidget(projectPath, Widget) {
  var widget = new Widget('we-cf-video', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    var eventId = eventModule.getEventIdFromWidget(widget, res);
    if (!eventId) return next();

    var where =  { eventId: eventId };
    if (widget.configuration.vid)
      where.id = widget.configuration.vid;

    req.we.db.models.cfvideo.findOne({
      where: where
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