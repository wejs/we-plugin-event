module.exports = {
  find: function find(req, res, next) {
    res.locals.query.where.eventId = res.locals.event.id;

    return res.locals.Model.findAndCountAll(res.locals.query)
    .then(function (record) {
      if (!record) return next();

      res.locals.metadata.count = record.count;
      res.locals.record = record.rows;
      return res.ok();
    });
  },
  create: function create(req, res) {
    var we = req.getWe();

    if (!res.locals.record) res.locals.record = {};
    // set temp record for use in validation errors
    req.we.utils._.merge(res.locals.record, req.query);

    res.locals.record.eventId = req.params.eventId;

    if (req.method === 'POST') {

      if(req.isAuthenticated()) req.body.creatorId = req.user.id;

      req.body.eventId = req.params.eventId;

      req.we.utils._.merge(res.locals.record, req.body);

      return res.locals.Model.create(req.body)
      .then(function (record) {
        res.locals.record = record;
        if (res.locals.responseType == 'html') {
          return res.redirect(we.router.urlTo(
            'cftopic.managePage',
            [record.eventId, record.id],
            we
          ));
        }
        res.created();
      }).catch(res.queryError);
    } else {
      res.locals.record = req.query;
      res.ok();
    }
  },
  edit: function edit(req, res) {
    var we = req.getWe();
    if (!res.locals.record) return res.notFound();

    if (req.method == 'POST' || req.method == 'PUT') {
      req.body.eventId = req.params.eventId;

      res.locals.record.updateAttributes(req.body)
      .then(function() {
        if (res.locals.responseType == 'html') {
          return res.redirect(we.router.urlTo(
            'cftopic.managePage',
            [res.locals.record.eventId, res.locals.record.id],
            we
          ));
        }
        res.ok();
      }).catch(res.queryError);
    } else {
      res.ok();
    }
  },
  delete: function deletePage(req, res) {
    var we = req.getWe();

    if (!res.locals.template)
      res.locals.template = res.local.model + '/' + 'delete';

    var record = res.locals.record;
    if (!record) return res.notFound();

    res.locals.deleteMsg = res.locals.model+'.delete.confirm.msg';

    res.locals.deleteRedirectUrl = we.router.urlTo(
      'cftopic.managePage', [res.locals.record.eventId, res.locals.record.id],
      we
    );

    if (req.method === 'POST') {

      record.destroy()
      .then(function() {
        res.locals.deleted = true;
        return res.deleted();
      }).catch(res.queryError);
    } else {
      return res.ok();
    }
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