var eventModule = require('../../../lib');
var widgetUtils = require('../../../lib/widgetUtils');

module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-news', __dirname);

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

    var where =  { eventId: res.locals.event.id };
    if (widget.configuration.nid)
      where.id = widget.configuration.nid;

    req.we.db.models.cfnews.findOne({
      where: where
    }).then(function afterLoadCfNews (r){
      if (!r) {
        widget.hide = true;
        return next();
      }
      widget.record = r;
      return next();
    }).catch(next);
  }

  widget.beforeSave = function beforeSave (req, res, next){
    req.body.configuration = {
      nid: req.body.nid
    };
    return next();
  };

  return widget;
};