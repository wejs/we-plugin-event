module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-partners', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    var we = req.getWe();
    var cfId;
    if (res.locals.conference) {
      cfId = res.locals.conference.id;
    } else {
      var ctx = widget.dataValues.context.split('-');
      if ( (ctx[0] == 'conference') && ctx[1] && Number(ctx[1]) )
        cfId = ctx[1];
    }
    if (!cfId) return next();

    we.db.models.cfpartner.findAll({
      where: { conferenceId: cfId },
      order: [ ['weight','ASC'], ['createdAt','ASC'] ]
    }).then(function (cfpartner) {
      widget.partners = cfpartner;
      next();
    }).catch(next);
  }

  return widget;
};