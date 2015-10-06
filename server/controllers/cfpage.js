module.exports = {
  find: function find(req, res, next) {
    if (!res.locals.event) return next();

    res.locals.query.where.eventId = res.locals.event.id;

    return res.locals.Model.findAndCountAll(res.locals.query)
    .then(function (record) {
      if (!record) return next();

      res.locals.metadata.count = record.count;
      res.locals.data = record.rows;

      return res.ok();
    });
  },
  findOne: function findOne(req, res, next) {
    if (!res.locals.data) return next();

    if (req.params.eventId != res.locals.data.eventId)
      return next();

    req.we.hooks.trigger('we:after:send:ok:response', {
      res: res, req: req
    }, function (err) {
      if (err) return res.serverError(err);
      return res.ok();
    });
  },
  managePage: function managePage(req, res, next) {
    if (!res.locals.event) return next();

    res.locals.query.where.eventId = res.locals.event.id;

    return res.locals.Model.findAndCountAll(res.locals.query)
    .then(function (record) {
      if (!record) return res.notFound();

      res.locals.metadata.count = record.count;
      res.locals.data = record.rows;

      return res.ok();
    });
  }
};