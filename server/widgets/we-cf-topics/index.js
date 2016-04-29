var eventModule = require('../../../lib');
var widgetUtils = require('../../../lib/widgetUtils');

module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-topics', __dirname);

  widget.checkIfIsValidContext = widgetUtils.checkIfIsValidContext;
  widget.isAvaibleForSelection = widgetUtils.isAvaibleForSelection;
  widget.beforeSave = widgetUtils.beforeSave;
  widget.renderVisibilityField = widgetUtils.renderVisibilityField;

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    if (!res.locals.event || !res.locals.event.topics || !res.locals.event.topics.length) {
      widget.hide = true;
    } else {
      widget.topics = res.locals.event.topics;
    }

    next();

  }

  return widget;
};