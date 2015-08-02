var _ = require('lodash');
var async = require('async');

module.exports = {
  adminIndex: function adminIndex(req, res) {
    res.ok();
  },

  adminMenu: function adminMenu(req, res) {
    res.locals.title = req.__('Menus');
    res.ok();
  },

  resetConferenceMenu: function resetConferenceMenu(req, res) {
    var we = req.getWe();

    we.db.models.cfmenu.destroy({
      where: { conferenceId: res.locals.conference.id }
    }).then(function (result) {
      we.log.info('conference resetConferenceMenu result: ', result);
      res.locals.conference.generateDefaultMenus(function(err) {
        if (err) return res.serverError(err);

        res.redirect('/conference/' + res.locals.conference.id + '/admin/menu');
      });
    }).catch(res.serverError);
  },

  adminLayouts: function adminLayouts(req, res) {
    var we = req.getWe();

    res.locals.title = req.__('Layouts');

    res.locals.conferenceLayouts = we.view.themes[res.locals.theme].layouts;
    return res.ok();
  },

  adminLayout: function adminLayout(req, res) {
    var we = req.getWe();

    var layoutToUpdate = we.view.themes[res.locals.theme].layouts[req.params.name];
    if (!layoutToUpdate)  return res.notFound();

    if (!res.locals.data) res.locals.data = {};

    res.locals.title = req.__('Layout') + ' - ' + req.params.name

    // find conference widgets
    we.db.models.widget.findAll({
      where: {
        theme: res.locals.theme,
        layout: req.params.name,
        context: (res.locals.widgetContext || null)
      },
      order: 'weight ASC'
    }).then(function (widgets) {

      res.locals.data.regions = _.cloneDeep(layoutToUpdate.regions);
      res.locals.data.widgets = we.view.widgets;

      widgets.forEach(function (w) {
        var regionName = w.regionName;
        if (!regionName) regionName = 'No region';

        if (!res.locals.data.regions[regionName]) res.locals.data.regions[regionName] = {
          name: regionName,
          widgets: []
        };
        if (!res.locals.data.regions[regionName].widgets)
          res.locals.data.regions[regionName].widgets = [];

        res.locals.data.regions[regionName].widgets.push(w);
      });

      res.locals.data.layout = req.params.name;
      res.locals.data.currentTheme = we.view.themes[res.locals.theme];
      res.locals.data.themeName = res.locals.theme;

      res.view();
    });
  },

  /**
   * Create or update one conference widget
   */
  saveWidget: function saveWidget(req, res, next) {
    var we = req.getWe();

    if (!res.locals.conference || !res.locals.widgetContext)
      return res.forbidden();

    req.body.context = res.locals.widgetContext;

    we.utils.async.series([
      function checkContextAndPermissions(done) {
        // modelName is required
        if (!req.body.modelName) {
          req.body.modelId = null;
          return done();
        } else if (req.body.modelName) {
          // not is a conference model
          if (we.config.conference.models.indexOf(req.body.modelName) === -1)
            return done('modelName not is a valid conference model');
          if (req.body.modelName === 'conference') {
            // current conference
            req.body.modelId = res.locals.conference.id;
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
            // only allow add widgets in models how are inside current conference
            if (r.conferenceId != res.locals.conference.id) {
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

    if (!res.locals.conference || !res.locals.widgetContext)
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
   * Update multiple conference widgets weight attribute
   */
  sortWidgets: function sortWidgets(req, res) {
    var we = req.getWe();

    if (!req.body.widgets)
      return res.badRequest('widgets body params is required');

    async.each(req.body.widgets, function (w, next) {
      // only update weight field
      we.db.models.widget.update(w, {
        where: {
          id: w.id,
          context: res.locals.widgetContext
        }, fields: ['weight']})
      .then(function () {
        next();
      }).catch(next);
    }, function (err) {
      if (err) return res.serverError(err);
      res.send();
    })
  },


  /**
   * Authenticated user area inside the conference
   */
  my: function my(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();
    res.ok();
  }
};