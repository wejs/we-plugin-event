var widgetUtils = require('../../../lib/widgetUtils');

module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-speakers', __dirname);

  widget.checkIfIsValidContext = widgetUtils.checkIfIsValidContext;
  widget.isAvaibleForSelection = widgetUtils.isAvaibleForSelection;
  widget.beforeSave = widgetUtils.beforeSave;
  widget.renderVisibilityField = widgetUtils.renderVisibilityField;

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    var we = req.getWe();
    var cfId;
    if (res.locals.event) {
      cfId = res.locals.event.id;
    } else {
      var ctx = widget.dataValues.context.split('-');
      if ( (ctx[0] == 'event') && ctx[1] && Number(ctx[1]) )
        cfId = ctx[1];
    }
    if (!cfId) {
      widget.hide = true;
      return next();
    }

    we.db.models.cfspeaker.findAll({
      where: { eventId: cfId },
      order: [ ['weight','ASC'], ['createdAt','ASC'] ]
    }).then(function afterLoadCfSpeaker (cfspeakers){
      if (!cfspeakers || !cfspeakers.length) {
        widget.hide = true;
      }

      widget.speakers = cfspeakers;
      next();
    }).catch(next);
  }

  return widget;
};