var eventModule = require('../../../lib');
var widgetUtils = require('../../../lib/widgetUtils');

module.exports = function cfVideoWidget(projectPath, Widget) {
  var widget = new Widget('we-cf-video', __dirname);

  widget.checkIfIsValidContext = widgetUtils.checkIfIsValidContext;
  widget.isAvaibleForSelection = widgetUtils.isAvaibleForSelection;
  widget.beforeSave = widgetUtils.beforeSave;
  widget.renderVisibilityField = widgetUtils.renderVisibilityField;

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    var eventId = eventModule.getEventIdFromWidget(widget, res);
    if (!eventId) {
      widget.hide = true;
      return next();
    }

    var where =  { eventId: eventId };
    if (widget.configuration.vid)
      where.id = widget.configuration.vid;

    req.we.db.models.cfvideo.findOne({
      where: where
    }).then(function afterFind(r) {
      if (!r) {
        widget.hide = true;
        return next();
      }
      widget.cfvideo = r;
      return next();
    }).catch(next);
  }

  widget.beforeSave = function beforeSave(req, res, next) {
    if (!req.body.configuration) req.body.configuration = {};
    req.body.configuration.vid = req.body.vid;
    return next();
  };

  return widget;
};