var eventModule = require('../../../lib');
var widgetUtils = require('../../../lib/widgetUtils');

module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-partners', __dirname);

  widget.checkIfIsValidContext = widgetUtils.checkIfIsValidContext;
  widget.isAvaibleForSelection = widgetUtils.isAvaibleForSelection;
  widget.beforeSave = widgetUtils.beforeSave;
  widget.renderVisibilityField = widgetUtils.renderVisibilityField;

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    var eventId = eventModule.getEventIdFromWidget(widget, res);
    if (!eventId) return next();

    req.we.db.models.cfpartner.findAll({
      where: { eventId: eventId },
      order: [ ['weight','ASC'], ['createdAt','ASC'] ]
    }).then(function (cfpartner) {
      widget.partners = cfpartner;
      next();
    }).catch(next);
  }

  return widget;
};