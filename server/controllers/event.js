module.exports = {
  findOne: function findOne(req, res, next) {
    if (!res.locals.data) return res.notFound();

    req.we.hooks.trigger('we-plugin-event:before:send:event', {
      req: res, res: res, next: next
    }, function afterRunHook(err) {
      if (err) return res.serverError(err);

      res.ok();
    });
  },

  find: function find(req, res) {
    if (req.query.my) {
      if (!req.isAuthenticated()) return res.forbidden();
      res.locals.query.include.push({
        model: req.we.db.models.user, as: 'managers',
        where: { id: req.user.id }
      });
    } else {
      res.locals.query.where.published = true;
      res.locals.query.where.eventEndDate = {
        gte: new Date()
      };
    }

    // filter by tag
    if (req.query.tag) {
      res.locals.query.include.push({
        model: req.we.db.models.modelsterms, as: 'tagsRecords',
        required: true,
        include: [{
          model: req.we.db.models.term, as: 'term',
          required: true,
          where: { text: req.query.tag }
        }]
      });
    }

    res.locals.Model.findAll(res.locals.query)
    .then(function afterLoad(records) {
      res.locals.data = records;

      res.locals.Model.count(res.locals.query)
      .then(function afterCount(count) {

        res.locals.metadata.count = count;

        res.ok();
      }).catch(res.queryError);
    }).catch(res.queryError);
  },

  create: function create(req, res) {
    if (!res.locals.template) res.locals.template = res.locals.model + '/' + 'create';

    if (!res.locals.data) res.locals.data = {};

    if (req.method === 'POST') {
      if (req.isAuthenticated()) req.body.creatorId = req.user.id;

      // set temporary record for use in validation errors
      req.we .utils._.merge(res.locals.data, req.body);

      return res.locals.Model.create(req.body)
      .then(function afterCreate(record) {
        res.locals.data = record;

        res.addMessage('success', {
          text: 'event.create.success',
          vars: { record: record }
        });

        res.locals.redirectTo = '/event/'+record.id+'/edit';
        res.created();
      }).catch(res.queryError);
    } else {
      res.ok();
    }
  },

  edit: function edit(req, res) {
    if (!res.locals.data) return res.notFound();

    if (req.method === 'POST' || req.method === 'PUT') {

      res.locals.data.updateAttributes(req.body)
      .then(function afterUpdate() {

        res.addMessage('success', {
          text: 'event.updated.success',
          vars: { record: res.locals.data }
        });

        if (req.body.save_next) {
          var ns = 2;
          if (req.query.step) ns = Number(req.query.step)+1;

          res.locals.redirectTo = req.path + '?step='+ns;
        }

        res.updated();
      }).catch(res.queryError);
    } else {
      res.ok();
    }
  },

  adminIndex: function adminIndex(req, res) {
    req.we.hooks.trigger('we-plugin-event:before:send:admin:index', {
      req: req, res: res
    }, function afterLoadAllDataInAdminIndex(err) {
      if (err) return res.serverError(err);

      res.ok();
    });
  },

  adminMenu: function adminMenu(req, res) {
    res.locals.title = req.__('Menus');
    res.ok();
  },

  resetConferenceMenu: function resetConferenceMenu(req, res) {
    var we = req.we;

    we.db.models.cfmenu.destroy({
      where: { eventId: res.locals.event.id }
    }).then(function (result) {
      we.log.info('event resetConferenceMenu result: ', result);
      res.locals.event.generateDefaultMenus(function(err) {
        if (err) return res.serverError(err);

        res.redirect('/event/' + res.locals.event.id + '/admin/menu');
      });
    }).catch(res.serverError);
  },

  setManagers: function setManagers(req, res, next) {
    var we = req.we;

    if (req.method == 'POST') {
      if (req.body.idToAdd)
        return we.controllers.event.addManager(req, res, next);

      if (req.body.idToRemove)
        return we.controllers.event.removerManager(req, res, next);

      res.ok();
    } else {
      res.ok();
    }
  },

  addManager: function addManager(req, res) {
    var we = req.we;

    if (!Number(req.body.idToAdd)) return res.badRequest();

    we.db.models.user.findById(req.body.idToAdd)
    .then(function afterFindUser(mu) {
      if (!mu) {
        res.addMessage('error', 'user.not.found');
        return res.ok();
      }
      var event = res.locals.event;
      event.addManager(mu)
      .then(function afterAdd() {
        event.getManagers().then(function afterFind(managers) {
          res.locals.event.managers = managers;
          res.addMessage('success', 'event.manager.add.success');
          res.ok();
        }).catch(res.queryError);
      }).catch(res.queryError);
    }).catch(res.queryError);
  },

  removerManager: function removerManager(req, res) {
   var we = req.we;

    if (!Number(req.body.idToRemove)) return res.badRequest();

    we.db.models.user.findById(req.body.idToRemove)
    .then(function (mu) {
      if (!mu) {
        res.addMessage('error', 'user.not.found');
        return res.ok();
      }

      var event = res.locals.event;

      event.removeManager(mu).then(function() {
        // TODO removeManager dont are updating event.managers list then we need to get it
        event.getManagers().then(function(managers) {
          res.locals.event.managers = managers;

          res.addMessage('success', 'event.manager.remove.success');
          res.ok();
        }).catch(res.queryError);
      }).catch(res.queryError);
    }).catch(res.queryError);
  }
};