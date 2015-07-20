var _= require('lodash');
var async = require('async');

var linkSortAttrs = ['weight', 'id', 'depth', 'parent'];

module.exports = {

  create: function create(req, res) {
    if (!res.locals.record) res.locals.record = {};

     _.merge(res.locals.record, req.query);

    if (req.method === 'POST') {
      if(req.isAuthenticated()) req.body.creatorId = req.user.id;
      req.body.conferenceId = res.locals.conference.id;
      req.body.cfmenuId = req.params.cfmenuId;
      // set temp record for use in validation errors
      res.locals.record = req.query;
      _.merge(res.locals.record, req.body);

      return res.locals.Model.create(req.body)
      .then(function (record) {
        res.locals.record = record;
        if (res.locals.responseType == 'html')
          return res.redirect(
            '/conference/' + res.locals.conference.id + '/admin/menu/' + req.params.cfmenuId
          );
        res.created();
      }).catch(res.queryError);
    } else {
      res.locals.record = req.query;
      res.ok();
    }
  },
  edit: function edit(req, res) {
    if (!res.locals.record) return res.notFound();

    if (req.method === 'POST') {
      // dont change conference id for registration type
      if (req.isAuthenticated()) req.body.creatorId = req.user.id;
      req.body.conferenceId = res.locals.conference.id;
      req.body.cfmenuId = req.params.cfmenuId;

      res.locals.record.updateAttributes(req.body)
      .then(function() {
        if (res.locals.responseType == 'html')
          return res.redirect(
           '/conference/' + res.locals.conference.id + '/admin/menu/' + req.params.cfmenuId
          );
        res.created();
      }).catch(res.queryError);

    } else {
      res.ok();
    }
  },
  sortLinks: function sortLinks(req, res) {
    var we = req.getWe();

    if (!req.body) return res.send();

    we.db.models.cfmenu.findOne({
      where: { id: req.params.cfmenuId}, include: { all: true }
    }).then(function (cfmenu) {
      if (!cfmenu) return res.notFound();

      var itensToSave = {};
      var linkAttrs;

      for (var item in req.body) {
        linkAttrs = item.split('-');

        if (linkAttrs.length !== 3) continue;
        if (linkAttrs[0] !== res.locals.model) continue;
        if (_.isNumber(linkAttrs[1])) continue;
        if (linkSortAttrs.indexOf(linkAttrs[2]) === -1) continue;

        if (!itensToSave[linkAttrs[1]]) itensToSave[linkAttrs[1]] = {};

        itensToSave[linkAttrs[1]][linkAttrs[2]] = req.body[item];
      }

      async.each(cfmenu.links, function(link, next) {
        if (!itensToSave[link.id]) return next();

        link.updateAttributes(itensToSave[link.id])
        .then(function() {
          next();
        }).catch(next);
      }, function(err) {
        if (err) return res.serverError(err);
        res.send();
      });

    }).catch(res.queryError);

  }
};