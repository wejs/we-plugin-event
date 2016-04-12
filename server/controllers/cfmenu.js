module.exports = {
  findOne: function findOne(req, res, next) {
    if (!res.locals.data) return next();

    if (req.accepts('html')) {
      return res.redirect(
        '/event/' + res.locals.event.id + '/admin/cfmenu/' + req.params.cfmenuId+ '/edit'
      );
    }
    return res.ok();
  },

  createPage: function createPage(req, res) {
    if (!res.locals.data) res.locals.data = {};

     req.we.utils._.merge(res.locals.data, req.query);

    if (req.method === 'POST') {

      if(req.isAuthenticated()) req.body.creatorId = req.user.id;
      req.body.eventId = res.locals.event.id;
      // set temp record for use in validation errors

      res.locals.data = req.query;
      req.we.utils._.merge(res.locals.data, req.body);

      return res.locals.Model.create(req.body)
      .then(function (record) {

        res.locals.data = record;
        if (req.accepts('html'))
          return res.redirect(
            '/event/' + res.locals.event.id + '/admin/cfmenu/' + req.params.cfmenuId+ '/edit'
          );

        res.created();
      }).catch(res.queryError);
    } else {
      res.locals.data = req.query;
      res.ok();
    }
  },

  editPage: function editPage(req, res) {
    if (!res.locals.data) return res.notFound();

    if (req.method === 'POST') {
      // dont change event id for registration type
      req.body.eventId = res.locals.event.id;

      res.locals.data.updateAttributes(req.body)
      .then(function() {
        if (req.accepts('html'))
          return res.redirect(
            '/event/' + res.locals.event.id + '/admin/cfmenu/' + req.params.cfmenuId+ '/edit'
          );
        res.created();
      }).catch(res.queryError);

    } else {
      res.ok();
    }
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