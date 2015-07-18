var _ = require('lodash');
var async = require('async');

module.exports = {
  findOne: function findOne(req, res, next) {
    var we = req.getWe();

    if (!res.locals.record) return next();

    async.parallel([
      function (done) {
        we.db.models.cfkeynote.findAll({
          where: { conferenceId: res.locals.record.id },
          order: [ ['weight','ASC'], ['createdAt','ASC'] ]
        }).then(function(cfkeynotes) {
          res.locals.cfkeynotes = cfkeynotes;
          done();
        }).catch(done);
      }
    ], function(err) {
      if (err) return res.serverError(err);

      we.hooks.trigger('we:after:send:ok:response', {
        res: res, req: req
      }, function (err) {
        if (err) return res.serverError(err);
        return res.ok();
      });
    })
  },

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

  saveWidget: function saveWidget(req, res) {
    var we = req.getWe();

    res.locals.layout = false;
    if (req.isAuthenticated()) req.body.creatorId = req.user.id;

    var type = req.body.type;
    we.view.widgets[type].afterSave(req, res, function() {
      res.locals.Model.create(req.body)
      .then(function (record) {

        res.locals.template = record.type + '/wiew';
        res.status(201);

        record.dataValues.html = we.view.widgets[record.type].render({
          locals: res.locals,
          widget: record
        }, res.locals.theme);

        if (res.locals.responseType == 'html') {
          return res.send(record.dataValues.html);
        } else {
          res.locals.record = record;
          return res.created();
        }

      });
    });
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
  }
};