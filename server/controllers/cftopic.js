var _ = require('lodash');

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
    var we = req.getWe();

    if (!res.locals.record) res.locals.record = {};
    // set temp record for use in validation errors
    _.merge(res.locals.record, req.query);

    res.locals.record.conferenceId = req.params.conferenceId;

    if (req.method === 'POST') {

      req.body.creatorId = req.user.id;
      req.body.conferenceId = req.params.conferenceId;

      _.merge(res.locals.record, req.body);

      return res.locals.Model.create(req.body)
      .then(function (record) {
        res.locals.record = record;
        if (res.locals.responseType == 'html') {
          return res.redirect(we.router.urlTo(
            'cftopic.managePage',
            [record.conferenceId, record.id],
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
  editPage: function editPage(req, res) {
    var we = req.getWe();

    if (!res.locals.record) return res.notFound();

    if (req.method == 'POST' || req.method == 'PUT') {
      req.body.conferenceId = req.params.conferenceId;

      res.locals.record.updateAttributes(req.body)
      .then(function() {
        if (res.locals.responseType == 'html') {
          return res.redirect(we.router.urlTo(
            'cftopic.managePage',
            [res.locals.record.conferenceId, res.locals.record.id],
            we
          ));
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