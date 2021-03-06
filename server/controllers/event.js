module.exports = {
  /**
   * Event location page, by default will show one map with event location to user
   */
  location(req, res, next) {
    res.locals.data = res.locals.event;
    req.we.controllers.event.findOne(req, res, next);
  },

  find(req, res) {
    const we = req.we,
      models = we.db.models;

    if (req.query.my) {
      if (!req.isAuthenticated()) return res.forbidden();
      res.locals.query.include.push({
        model: models.user, as: 'managers',
        where: { id: req.user.id }
      });
    } else {
      res.locals.query.where.published = true;
    }

    if (req.query.q) {
      res.locals.query.where[we.Op.or] = [{
        title: { [we.Op.like]: '%'+req.query.q+'%' }
      }, {
        about: { [we.Op.like]: '%'+req.query.q+'%' }
      }]
    }

    // filter by tag
    if (req.query.tag) {
      res.locals.query.include.push({
        model: models.modelsterms, as: 'tagsRecords',
        required: true,
        include: [{
          model: models.term, as: 'term',
          required: true,
          where: { text: req.query.tag }
        }]
      });
    }

    res.locals.query.order = [
      ['registrationStartDate', 'DESC'],
      ['eventStartDate', 'DESC']
    ];

    res.locals.Model
    .findAll(res.locals.query)
    .then(function afterLoad(records) {
      res.locals.data = records;

      return res.locals.Model
      .count(res.locals.query)
      .then(function afterCount(count) {

        res.locals.metadata.count = count;

        if (!req.isAuthenticated()) return res.ok();

        // if user is authenticated load its registration status
        req.we.utils.async.eachSeries(res.locals.data, function (r, next) {
          // load current user registration register
          models.cfregistration.findOne({
            where: { eventId: r.id, userId: req.user.id }
          })
          .then(function afterFindRegistration(cfr) {
            r.userCfregistration = cfr;
            next();
            return null;
          })
          .catch(next);
        }, function afterEach(err) {
          if (err) return res.queryError(err);
          return res.ok();
        });
      });
    })
    .catch(res.queryError);
  },

  create(req, res) {
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

  edit(req, res) {
    if (!res.locals.data) return res.notFound();

    if (req.method === 'POST' || req.method === 'PUT') {

      res.locals.data
      .updateAttributes(req.body)
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

        return res.updated();
      })
      .catch(res.queryError);
    } else {
      res.ok();
    }
  },

  adminIndex(req, res) {
    req.we.utils.async.parallel([
      function loadCfSessions(done) {
        return req.we.db.models.cfsession.findAll({
          where: {
            eventId: res.locals.event.id,
            requireRegistration: 1
          },
          include: [
            { model: req.we.db.models.cfroom, as: 'room' },
            { model: req.we.db.models.cfregistration, as: 'subscribers' }
          ]
        })
        .then(function afterLoadCfsessions(cfsessions) {
          res.locals.sessionsToRegister = cfsessions;

          done();
          return null;
        })
        .catch(done);
      }
    ], function afterLoadAllData(err) {
      if (err) return res.queryError(err);

      res.ok();
    });
  },

  adminMenu: function adminMenu(req, res) {
    res.locals.title = req.__('Menus');
    res.ok();
  },

  resetConferenceMenu(req, res) {
    const we = req.we;

    we.db.models.cfmenu.destroy({
      where: { eventId: res.locals.event.id }
    })
    .then(function (result) {
      we.log.info('event resetConferenceMenu result: ', result);
      res.locals.event.generateDefaultMenus(function(err) {
        if (err) return res.serverError(err);

        res.redirect('/event/' + res.locals.event.id + '/admin/menu');
      });
      return null;
    })
    .catch(res.queryError);
  },

  setManagers(req, res, next) {
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

  addManager(req, res) {
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

  removerManager(req, res) {
   var we = req.we;

    if (!Number(req.body.idToRemove)) return res.badRequest();

    we.db.models.user.findById(req.body.idToRemove)
    .then(function (mu) {
      if (!mu) {
        res.addMessage('error', 'user.not.found');
        return res.ok();
      }

      const event = res.locals.event;

      return event.removeManager(mu)
      .then(function() {
        // TODO removeManager dont are updating event.managers list then we need to get it
        return event.getManagers()
        .then(function(managers) {
          res.locals.event.managers = managers;

          res.addMessage('success', 'event.manager.remove.success');
          return res.ok();
        });
      });
    })
    .catch(res.queryError);
  }
};