module.exports = {
  createPage: function createPage(req, res) {
    if (!res.locals.data) res.locals.data = {};

    req.we.utils._.merge(res.locals.data, req.query);

    if (req.method === 'POST') {

      req.body.creatorId = req.user.id;
      req.body.eventId = res.locals.event.id;
      // set temp record for use in validation errors
      res.locals.data = req.query;
      req.we.utils._.merge(res.locals.data, req.body);

      return res.locals.Model.create(req.body)
      .then(function (record) {

        res.locals.data = record;
        if (res.locals.responseType == 'html')
          return res.redirect(
            '/event/' + res.locals.event.id + '/admin/registration/type'
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
        if (res.locals.responseType == 'html')
          return res.redirect(
            '/event/' + res.locals.event.id + '/admin/registration/type'
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

    var record = res.locals.data;
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
  },

  markAllAsPresent: function markAllAsPresent(req, res) {
    req.we.db.models.cfregistration.update({
      present: true
    }, {
      where: {
        eventId: res.locals.event.id,
        present: false
      }
    }).then(function (r) {
      res.locals.metadata = r[0];

      if (req.body.redirectTo) {
        res.addMessage('success', 'cfregistrationtype.markAllAsPresent.success');
        res.goTo(req.body.redirectTo);
      } else {
        return res.send(res.locals.metadata);
      }
    }).catch(res.queryError);
  }
}