module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-partners', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    var we = req.getWe();
    if (!res.locals.conference) return next();

    we.db.models.cfpartner.findAll({
      where: { conferenceId: res.locals.conference.id },
      order: [ ['weight','ASC'], ['createdAt','ASC'] ]
    }).then(function (cfpartner) {
      widget.partners = cfpartner;
      next();
    }).catch(next);
  }

  return widget;
};