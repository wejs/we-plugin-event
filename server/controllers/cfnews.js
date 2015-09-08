module.exports = {
  find: function find(req, res, next) {
    res.locals.query.eventId = res.locals.event.id;

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
    we.utils._.merge(res.locals.record, req.query);

    res.locals.record.eventId = req.params.eventId;

    if (req.method === 'POST') {

      if(req.isAuthenticated()) req.body.creatorId = req.user.id;
      req.body.eventId = req.params.eventId;

      we.utils._.merge(res.locals.record, req.body);

      return res.locals.Model.create(req.body)
      .then(function (record) {
        if (res.locals.responseType == 'html') {
          // push id to paramsArray for use in urlTo
          req.paramsArray.push(record.id);
          // redirect to content after create
          return res.redirect(we.router.urlTo(res.locals.model + '.findOne', req.paramsArray));
        }
        res.locals.record = record;
        res.created();
      }).catch(res.queryError);
    } else {
      res.locals.record = req.query;
      res.ok();
    }
  },
  edit: function edit(req, res) {
    var we = req.getWe();
    var record = res.locals.record;
    if (!record) return res.notFound();

    res.locals.record = record;

    if (req.method == 'POST' || req.method == 'PUT') {

      req.body.eventId = req.params.eventId;

      record.updateAttributes(req.body)
      .then(function() {
        if (res.locals.responseType == 'html') {
          // push id to paramsArray for use in urlTo
          req.paramsArray.push(record.id);
          // redirect to content after create
          return res.redirect(we.router.urlTo(res.locals.model + '.findOne', req.paramsArray));
        }
        res.ok();
      }).catch(res.queryError);
    } else {
      res.ok();
    }
  },
  managePage: function managePage(req, res) {
    return res.locals.Model.findAndCountAll(res.locals.query)
    .then(function (record) {
      if (!record) return res.notFound();

      res.locals.metadata.count = record.count;
      res.locals.record = record.rows;

      return res.ok();
    });
  }

};