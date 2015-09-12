module.exports = {
  find: function find(req, res, next) {
    return res.locals.Model.findAndCountAll(res.locals.query)
    .then(function (record) {
      if (!record) return next();

      res.locals.metadata.count = record.count;
      res.locals.record = record.rows;

      return res.ok();
    });
  },
  create: function create(req, res) {
    if (!res.locals.record) res.locals.record = {};
    // set temp record for use in validation errors
    req.we.utils._.merge(res.locals.record, req.query);

    res.locals.record.eventId = req.params.eventId;

    if (req.method === 'POST') {

      if(req.isAuthenticated()) req.body.creatorId = req.user.id;
      req.body.eventId = req.params.eventId;

      res.locals.record = req.query;
      req.we.utils._.merge(res.locals.record, req.body);

      return res.locals.Model.create(req.body)
      .then(function (record) {
        if (res.locals.responseType == 'html')
          return res.redirect(
            '/event/' + res.locals.event.id + '/admin/room'
          );

        res.created();
      }).catch(res.queryError);
    } else {
      res.locals.record = req.query;
      res.ok();
    }
  },
  edit: function edit(req, res) {
    var we = req.getWe();

    we.db.models.cfroom.findOne({where: {
        id: req.params.cfroomId
      }}).then(function (record) {
      if (!record) return res.notFound();

      res.locals.record = record;

      if (req.method == 'POST' || req.method == 'PUT') {

        req.body.eventId = req.params.eventId;

        record.updateAttributes(req.body)
        .then(function() {
        if (res.locals.responseType == 'html')
          return res.redirect(
            '/event/' + res.locals.event.id + '/admin/room'
          );
          res.ok();
        }).catch(res.queryError);
      } else {
        res.ok();
      }
    }).catch(res.queryError);
  },
  managePage: function managePage(req, res) {
    if (!res.locals.event) return res.notFound();

    res.locals.query.where.eventId = res.locals.event.id;

    return res.locals.Model.findAndCountAll(res.locals.query)
    .then(function (record) {
      if (!record) return res.notFound();

      res.locals.metadata.count = record.count;
      res.locals.record = record.rows;

      return res.ok();
    });
  }

};