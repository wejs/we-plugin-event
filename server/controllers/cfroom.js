module.exports = {
  find: function find(req, res) {
    res.locals.query.where.eventId = res.locals.event.id;

    res.locals.Model.findAll(res.locals.query)
    .then(function afterFind(record) {

      res.locals.data = record;

      res.locals.Model.findAll(res.locals.query)
      .then(function afterCount(count) {
        res.locals.metadata.count = count;
        return res.ok();
      }).catch(res.queryError);
    }).catch(res.queryError);
  },
  create: function create(req, res) {
    if (!res.locals.data) res.locals.data = {};

    res.locals.data.eventId = res.locals.event.id;

    if (req.method === 'POST') {

      if(req.isAuthenticated()) req.body.creatorId = req.user.id;
      req.body.eventId = req.params.eventId;

      req.we.utils._.merge(res.locals.data, req.body);

      return res.locals.Model.create(req.body)
      .then(function afterCreate(record) {
        res.locals.data = record;
        if (req.accepts('html')) {
          return res.goTo(
            '/event/' + res.locals.event.id + '/admin/room'
          );
        }
        res.created();
      }).catch(res.queryError);
    } else {
      res.ok();
    }
  },
  edit: function edit(req, res) {
    if(!res.locals.data) return res.notFound();

    if (req.method == 'POST' || req.method == 'PUT') {
      delete req.body.eventId;

      res.locals.data.updateAttributes(req.body)
      .then(function afterUpdate() {
        if (req.accepts('html')) {
          return res.goTo(
            '/event/' + res.locals.event.id + '/admin/room'
          );
        }
        res.updated();
      }).catch(res.queryError);
    } else {
      res.ok();
    }

  },
  managePage: function managePage(req, res, next) {
    // send to find action, this allows to set custom permissions and template for this action but with find logic
    req.we.controllers.cfroom.find(req, res, next);
  }
};