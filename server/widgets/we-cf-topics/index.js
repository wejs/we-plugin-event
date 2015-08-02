module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-topics', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    if (!res.locals.conference) {
      var we = req.getWe();

      if (!widget.dataValues.context) return next();

      var ctx = widget.dataValues.context.split('-');
      if ( (ctx[0] == 'conference') && ctx[1] && Number(ctx[1]) ) {
        we.db.models.cftopic.find({
          where: { conferenceId: ctx[1] }
        }).then(function (r){
          widget.topics = r;
          next();
        }).catch(next);
      } else {
        next();
      }
    } else {
      widget.topics = res.locals.conference.topics;
      next();
    }
  }

  return widget;
};