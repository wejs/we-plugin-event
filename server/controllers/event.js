module.exports = {
  location: function(req, res, next) {
    if (!res.locals.event) return res.notFound();

    res.locals.record = res.locals.event;
    req.we.controllers.event.findOne(req, res, next);
  },
  edit: function edit(req, res, next) {
    var record = res.locals.record;

    if (req.method === 'POST') {
      if (!record) return res.notFound();

      record.updateAttributes(req.body)
      .then(function() {
        res.locals.record = record;

        if (req.body.save_next) {
          var ns = 2;
          if (req.query.step) ns = Number(req.query.step)+1;

          res.locals.redirectTo = req.path + '?step='+ns;
        } else {
          res.locals.redirectTo = req.url;
        }


        return res.updated();
      }).catch(res.queryError);
    } else {
      res.ok();
    }
  },

  adminIndex: function adminIndex(req, res) {
    req.we.utils.async.parallel([
      function (done) {
        return req.we.db.models.cfsession.findAll({
          where: {
            eventId: res.locals.event.id,
            requireRegistration: 1
          },
          include: [
            { model: req.we.db.models.cfroom, as: 'room' },
            { model: req.we.db.models.cfregistration, as: 'subscribers' }
          ]
        }).then(function (cfsessions) {
          res.locals.sessionsToRegister = cfsessions;

          done();
        }).catch(done)
      }
    ], function (err) {
      if (err) return res.queryError(err);

      res.ok();
    });
  },

  adminMenu: function adminMenu(req, res) {
    res.locals.title = req.__('Menus');
    res.ok();
  },

  resetConferenceMenu: function resetConferenceMenu(req, res) {
    var we = req.getWe();

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

  /**
   * Create or update one event widget
   */
  saveWidget: function saveWidget(req, res, next) {
    var we = req.getWe();

    if (!res.locals.event || !res.locals.widgetContext)
      return res.forbidden();

    req.body.context = res.locals.widgetContext;

    we.utils.async.series([
      function checkContextAndPermissions(done) {
        // modelName is required
        if (!req.body.modelName) {
          req.body.modelId = null;
          return done();
        } else if (req.body.modelName) {
          // not is a event model
          if (we.config.event.models.indexOf(req.body.modelName) === -1)
            return done('modelName not is a valid event model');
          if (req.body.modelName === 'event') {
            // current event
            req.body.modelId = res.locals.event.id;
            return done();
          }
          // session widget
          if (!req.body.modelId) return done();
          // model widget
          // ćheck if this model exists
          return we.db.models[req.body.modelName]
          .findById(req.body.modelId).then(function (r) {
            if (!r) {
              req.body.modelId = null;
              return done();
            }
            // only allow add widgets in models how are inside current event
            if (r.eventId != res.locals.event.id) {
              req.body.modelName = null;
              req.body.modelId = null;
            }

            done();
          }).catch(done);
        }

        done();
      }
    ], function (err) {
      if (err) return res.serverError();

      if (req.params.widgetId) {
        we.controllers.widget.update(req, res, next);
      } else {
        we.controllers.widget.create(req, res, next);
      }
    });
  },

  deleteWidget: function deleteWidget(req, res, next) {
    var we = req.getWe();

    if (!res.locals.event || !res.locals.widgetContext)
      return res.forbidden();

    we.db.models.widget.findById(res.locals.id)
    .then(function(widget) {
      if(!widget) return res.notFound();
      if (widget.context !== res.locals.widgetContext) return res.forbidden();

      res.locals.record = widget;

      we.controllers.widget.destroy(req, res, next);
    }).catch(res.queryError);
  },
  /**
   * Sort multiple widgets
   */
  sortWidgets: function sortWidgets(req, res, next) {
    var we = req.getWe();

    we.controllers.widget.sortWidgets(req, res, next);
  },

  setManagers: function setManagers(req, res, next) {
    var we = req.getWe();

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
    var we = req.getWe();

    if (!Number(req.body.idToAdd)) return res.badRequest();

    we.db.models.user.findById(req.body.idToAdd)
    .then(function (mu) {
      if (!mu) {
        res.addMessage('error', 'user.not.found');
        return res.ok();
      }
      var event = res.locals.event;
      event.addManager(mu).then(function() {
        // TODO addManager dont are updating event.managers list then we need to get it
        event.getManagers().then(function(managers) {
          res.locals.event.managers = managers;
          res.addMessage('success', 'event.manager.add.success');
          res.ok();
        }).catch(res.queryError);
      }).catch(res.queryError);
    }).catch(res.queryError);
  },

  removerManager: function removerManager(req, res) {
   var we = req.getWe();

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
  },

  /**
   * Authenticated user area inside the event
   */
  my: function my(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();
    res.ok();
  }
};