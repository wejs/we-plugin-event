var eventModule = require('../../../lib');
var widgetUtils = require('../../../lib/widgetUtils');

module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-schedule', __dirname);

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

    we.db.models.cfsession.findAndCountAll({
      where: { eventId: eventId },
      order:[['startDate', 'ASC'], ['createdAt', 'ASC']]
    }).then(function afterLoadCfSession (result){
      var activeSet = false;

      if (!result.rows || !result.rows.length) widget.hide = true;

      widget.count = result.count;
      widget.record = result.rows;

      widget.days = {};
      var nodayString = req.__('cfsession.no.date');

      widget.record.forEach(function (r) {
        var sdate = we.utils.moment(r.startDate)
        var day;

        if (
          !r.startDate ||
          !we.utils.moment(r.startDate).isValid()
        ) {
          day = nodayString;
        } else {
          day = sdate.locale(we.config.i18n.defaultLocale).format('L');
        }

        if (!widget.days[day]) {
          widget.days[day] = {
            text: day,
            cfsession: []
          };

          if (!activeSet && day != nodayString) {
            widget.days[day].active = true;
            activeSet = true;
          }
        }

        widget.days[day].cfsession.push(r);
      });

      // reorder nodaystring
      if (widget.days[nodayString]) {
        var reord = widget.days[nodayString];
        delete widget.days[nodayString];
        widget.days[nodayString] = reord;

        if (!activeSet) widget.days[nodayString].active = true;
      }

      next();
    }).catch(next);
  }

  return widget;
};