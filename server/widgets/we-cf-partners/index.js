module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-partners', __dirname);

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
    if (!cfId) return next();

    we.db.models.cfpartner.findAll({
      where: { eventId: cfId },
      order: [ ['weight','ASC'], ['createdAt','ASC'] ]
    }).then(function (cfpartner) {
      widget.partners = cfpartner;
      next();
    }).catch(next);
  }

  return widget;
};