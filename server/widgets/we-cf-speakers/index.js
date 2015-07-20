module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-speakers', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    var we = req.getWe();

    if (!res.locals.conference) return next();

    we.db.models.cfspeaker.findAll({
      where: { conferenceId: res.locals.conference.id },
      order: [ ['weight','ASC'], ['createdAt','ASC'] ]
    }).then(function(cfspeakers) {
      widget.speakers = cfspeakers;
      next();
    }).catch(next);
  }

  return widget;
};