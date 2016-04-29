var eventModule = require('../../../lib');
var widgetUtils = require('../../../lib/widgetUtils');

module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-speakers', __dirname);

  widget.checkIfIsValidContext = widgetUtils.checkIfIsValidContext;
  widget.isAvaibleForSelection = widgetUtils.isAvaibleForSelection;
  widget.beforeSave = widgetUtils.beforeSave;
  widget.renderVisibilityField = widgetUtils.renderVisibilityField;

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    var we = req.we;

    var eventId = eventModule.getEventIdFromWidget(widget, res);
    if (!eventId) {
      widget.hide = true;
      return next();
    }

    we.db.models.cfspeaker.findAll({
      where: { eventId: eventId },
      order: [ ['weight','ASC'], ['createdAt','ASC'] ]
    }).then(function afterLoadCfSpeaker (cfspeakers) {
      if (!cfspeakers || !cfspeakers.length) {
        widget.hide = true;
      }

      widget.speakers = cfspeakers;
      next();
    }).catch(next);
  }

  return widget;
};