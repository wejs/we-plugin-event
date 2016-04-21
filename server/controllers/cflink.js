var helpers = require('../../lib/helpers');

module.exports = {
  findOne: function findOne(req, res, next) {
    if (!res.locals.data) return next();

    if (req.accepts('html')) {
      return res.goTo(
        '/event/' + res.locals.event.id + '/admin/cfmenu/' + req.params.cfmenuId+ '/edit'
      );
    }
    return res.ok();
  },
  create: function create(req, res) {
    if (!res.locals.data) res.locals.data = {};

    if (req.method === 'POST') {
      if(req.isAuthenticated()) req.body.creatorId = req.user.id;

      req.body.eventId = res.locals.event.id;
      req.body.cfmenuId = req.params.cfmenuId;

      // set temporary record for use in validation errors run in res.queryError
      req.we.utils._.merge(res.locals.data, req.body);

      return res.locals.Model.create(req.body)
      .then(function afterCreate(record) {
        res.locals.data = record;
        // add message
        res.addMessage('success', {
          text: 'cflink.create.success',
          vars: { record: record.toJSON() }
        });

        if (req.accepts('html')) {
          // redirect to cfmenu.edit if are html response
          return res.goTo(
            '/event/' + res.locals.event.id + '/admin/cfmenu/' + req.params.cfmenuId+ '/edit'
          );
        }

        res.created();
      }).catch(res.queryError);
    } else {
      // auto fill form data based in query params
      req.we.utils._.merge(res.locals.data, req.query);

      res.ok();
    }
  },
  edit: function edit(req, res) {
    if (!res.locals.data) return res.notFound();

    if (req.method === 'POST') {
      // never change eventId, cfmenuId and creator in edit request
      delete req.body.eventId;
      delete req.body.cfmenuId;
      delete req.body.creatorId;

      res.locals.data.updateAttributes(req.body)
      .then(function afterUpdate() {
        // add message
        res.addMessage('success', {
          text: 'cflink.updated.success',
          vars: { record: res.locals.data.toJSON() }
        });

        if (req.accepts('html')) {
          return res.goTo(
            '/event/' + res.locals.event.id + '/admin/cfmenu/' + req.params.cfmenuId+ '/edit'
          );
        }

        res.updated();
      }).catch(res.queryError);
    } else {
      res.ok();
    }
  },
  sortLinks: function sortLinks(req, res) {
    var redirectTo = req.we.utils.getRedirectUrl(req, res);

    if (!req.body) {
      // skip if dont are post request
      if (redirectTo) return res.goTo(redirectTo);
      return res.send();
    }

    req.we.db.models.cfmenu.findOne({
      where: { id: req.params.cfmenuId }, include: { all: true }
    }).then(function afterFindCurrentMenu(cfmenu) {
      if (!cfmenu) return res.notFound();

      var itensToSave = helpers.parseLinksFromBody(req);

      req.we.utils.async.eachSeries(cfmenu.links, function onEachLink(link, next) {
        if (!itensToSave[link.id]) return next();

        link.updateAttributes(itensToSave[link.id])
        .then(function afterUpdateLink() {
          next();
        }).catch(next);
      }, function afterUpdateAll(err) {
        if (err) return res.serverError(err);
        if (redirectTo) return res.goTo(redirectTo);
        res.send({ cfmenu: cfmenu });
      });
    }).catch(res.queryError);
  }
};