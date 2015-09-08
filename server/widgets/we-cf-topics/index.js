module.exports = function(projectPath, Widget) {
  var widget = new Widget('we-cf-topics', __dirname);

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    if (!res.locals.event) {
      var we = req.getWe();

      if (!widget.dataValues.context) return next();

      var ctx = widget.dataValues.context.split('-');
      if ( (ctx[0] == 'event') && ctx[1] && Number(ctx[1]) ) {
        we.db.models.cftopic.find({
          where: { eventId: ctx[1] }
        }).then(function (r){
          widget.topics = r;
          next();
        }).catch(next);
      } else {
        next();
      }
    } else {
      widget.topics = res.locals.event.topics;
      next();
    }
  }

  return widget;
};