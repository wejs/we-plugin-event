var eventModule = require('../../../lib');

module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-location-map', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    widget.eventId = eventModule.getEventIdFromWidget(widget, res);
    widget.API_KEY = req.we.config.apiKeys.googleMaps;
    next();
  }

  return widget;
};