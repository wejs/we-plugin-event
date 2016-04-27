module.exports = {
  create: function create(req, res) {
    var we = req.we;

    if (!res.locals.data) res.locals.data = {};

    if (req.method === 'POST') {
      res.locals.data.eventId = res.locals.event.id;

      if(req.isAuthenticated()) req.body.creatorId = req.user.id;

      req.we.utils._.merge(res.locals.data, req.body);

      return res.locals.Model.create(req.body)
      .then(function afterCreate(record) {
        res.locals.data = record;
        if (req.accepts('html') ) {
          return res.goTo(we.router.urlTo(
            'cftopic.managePage', [ res.locals.event.id ],
            we
          ));
        }

        res.created();
      }).catch(res.queryError);
    } else {
      res.ok();
    }
  },
  edit: function edit(req, res) {
    var we = req.we;

    if (!res.locals.data) return res.notFound();

    if (req.method == 'POST' || req.method == 'PUT') {
      delete req.body.eventId;

      res.locals.data.updateAttributes(req.body)
      .then(function afterUpdate() {
        if ( req.accepts('html') ) {
          return res.goTo(we.router.urlTo(
            'cftopic.managePage', [ res.locals.event.id, res.locals.data.id ],
            we
          ));
        }
        res.updated();
      }).catch(res.queryError);
    } else {
      res.ok();
    }
  },
  managePage: function managePage(req, res, next) {
    req.we.controllers.cftopic.find(req, res, next);
  }
};