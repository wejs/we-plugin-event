module.exports = {
  delete: function deletePage(req, res) {
    if (!res.locals.template)
      res.locals.template = res.locals.model + '/' + 'delete';

    if (!res.locals.data) return res.notFound();

    res.locals.deleteMsg = 'cfregistrationtype.delete.confirm.msg';

    if (req.method === 'POST' || req.method === 'DELETE') {
      req.we.db.models.cfregistration.count({
        where: { cfregistrationtypeId: res.locals.data.id }
      }).then(function afterLoadCFRcount(count) {
        if (count > 0) {
          return res.badRequest('cfregistrationtype.delete.have.registrations');
        }

        res.locals.data.destroy().then(function afterDelete() {
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
    }).then(function afterLoadCFR(r) {
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