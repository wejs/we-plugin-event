var widgetUtils = require('../../../lib/widgetUtils');

module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-topics', __dirname);

  widget.checkIfIsValidContext = widgetUtils.checkIfIsValidContext;
  widget.isAvaibleForSelection = widgetUtils.isAvaibleForSelection;
  widget.beforeSave = widgetUtils.beforeSave;
  widget.renderVisibilityField = widgetUtils.renderVisibilityField;

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    if (!res.locals.event) {
      var we = req.getWe();

      if (!widget.dataValues.context) {
        widget.hide = true;
        return next();
      }

      var ctx = widget.dataValues.context.split('-');

      if ( (ctx[0] == 'event') && ctx[1] && Number(ctx[1]) ) {
        we.db.models.cftopic.find({
          where: { eventId: ctx[1] }
        }).then(function afterLoadTopic (r){
          if (!r || !r.length) {
            widget.hide = true;
          }

          widget.topics = r;

          next();
        }).catch(next);
      } else {
        next();
      }
    } else {
      if (!res.locals.event.topics || !res.locals.event.topics.length)
        widget.hide = true;

      widget.topics = res.locals.event.topics;
      next();
    }
  }

  return widget;
};