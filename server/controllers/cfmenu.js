module.exports = {
  find: function find(req, res, next) {
    res.locals.query.conferenceId = res.locals.conference.id;

    return res.locals.Model.findAndCountAll(res.locals.query)
    .then(function (record) {
      if (!record) return next();

      res.locals.metadata.count = record.count;
      res.locals.record = record.rows;

      return res.ok();
    });
  },
  createPage: function createPage(req, res) {
    if (!res.locals.record) res.locals.record = {};

     req.we.utils._.merge(res.locals.record, req.query);

    if (req.method === 'POST') {

      if(req.isAuthenticated()) req.body.creatorId = req.user.id;
      req.body.conferenceId = res.locals.conference.id;
      // set temp record for use in validation errors

      res.locals.record = req.query;
      req.we.utils._.merge(res.locals.record, req.body);

      return res.locals.Model.create(req.body)
      .then(function (record) {

        res.locals.record = record;
        if (res.locals.responseType == 'html')
          return res.redirect(
            '/conference/' + res.locals.conference.id + '/admin/menu'
          );

        res.created();
      }).catch(res.queryError);
    } else {
      res.locals.record = req.query;
      res.ok();
    }
  },

  editPage: function editPage(req, res) {
    if (!res.locals.record) return res.notFound();

    if (req.method === 'POST') {
      // dont change conference id for registration type
      req.body.conferenceId = res.locals.conference.id;

      res.locals.record.updateAttributes(req.body)
      .then(function() {
        if (res.locals.responseType == 'html')
          return res.redirect(
            '/conference/' + res.locals.conference.id + '/admin/menu/'+ res.locals.record.id
          );
        res.created();
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