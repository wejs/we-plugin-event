var _ = require('lodash');

module.exports = {
  createPage: function createPage(req, res) {
    if (!res.locals.record) res.locals.record = {};

     _.merge(res.locals.record, req.query);

    if (req.method === 'POST') {

      req.body.creatorId = req.user.id;
      req.body.conferenceId = res.locals.conference.id;
      // set temp record for use in validation errors
      res.locals.record = req.query;
      _.merge(res.locals.record, req.body);

      return res.locals.Model.create(req.body)
      .then(function (record) {

        res.locals.record = record;
        if (res.locals.responseType == 'html')
          return res.redirect(
            '/conference/' + res.locals.conference.id + '/admin/registration/type'
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
            '/conference/' + res.locals.conference.id + '/admin/registration/type'
          );
        res.created();
      }).catch(res.queryError);

    } else {
      res.ok();
    }
  }
}