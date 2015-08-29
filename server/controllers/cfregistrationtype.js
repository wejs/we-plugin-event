module.exports = {
  createPage: function createPage(req, res) {
    if (!res.locals.record) res.locals.record = {};

    req.we.utils._.merge(res.locals.record, req.query);

    if (req.method === 'POST') {

      req.body.creatorId = req.user.id;
      req.body.conferenceId = res.locals.conference.id;
      // set temp record for use in validation errors
      res.locals.record = req.query;
      req.we.utils._.merge(res.locals.record, req.body);

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
  },
  delete: function deletePage(req, res) {
    if (!res.locals.template)
      res.locals.template = res.local.model + '/' + 'delete';

    var record = res.locals.record;
    if (!record) return res.notFound();

    res.locals.deleteMsg = res.locals.model+'.delete.confirm.msg';

    if (req.method === 'POST') {
      req.we.db.models.cfregistration.count({
        where: { cfregistrationtypeId: record.id }
      }).then(function (count){
        if (count > 0) {
          return res.badRequest('cfregistrationtype.delete.have.registrations');
        }

        record.destroy().then(function() {
          res.locals.deleted = true;
          return res.deleted();
        }).catch(res.queryError);

      }).catch(res.queryError);
    } else {
      return res.ok();
    }
  }
}