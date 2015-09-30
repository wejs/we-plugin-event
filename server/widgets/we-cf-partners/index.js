var eventModule = require('../../../lib');

module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-partners', __dirname);

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