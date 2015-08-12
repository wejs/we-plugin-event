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
  // create: function create(req, res) {
  //   if (!res.locals.record) res.locals.record = {};
  //   // set temp record for use in validation errors
  //   _.merge(res.locals.record, req.query);

  //   res.locals.record.conferenceId = req.params.conferenceId;

  //   if(req.isAuthenticated()) req.body.creatorId = req.user.id;
  //   req.body.conferenceId = req.params.conferenceId;

  //   if (req.method === 'POST') {
  //     _.merge(res.locals.record, req.body);
  //     return res.locals.Model.create(req.body)
  //     .then(function (record) {
  //       res.locals.record = record;
  //       res.created();
  //     }).catch(res.queryError);
  //   } else {
  //     res.locals.record = req.query;
  //     res.ok();
  //   }
  // },
  // edit: function edit(req, res) {
  //   var we = req.getWe();

  //   if (!res.locals.record) return res.notFound();

  //   req.body.conferenceId = req.params.conferenceId;

  //   if (req.method == 'POST' || req.method == 'PUT') {
  //     res.locals.record.updateAttributes(req.body)
  //     .then(function() {
  //       if (res.locals.responseType == 'html') {
  //         return res.redirect(we.router.urlTo(
  //           'conference_findOne.page_findOne',
  //           [res.locals.record.conferenceId, res.locals.record.id],
  //           we
  //         ));
  //       }
  //       res.ok();
  //     }).catch(res.queryError);
  //   } else {
  //     res.ok();
  //   }
  // },
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