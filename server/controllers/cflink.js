var linkSortAttrs = ['weight', 'id', 'depth', 'parent'];

module.exports = {
  findOne: function findOne(req, res, next) {
    if (!res.locals.data) return next();

    if (req.accepts('html')) {
      return res.redirect(
        '/event/' + res.locals.event.id + '/admin/cfmenu/' + req.params.cfmenuId+ '/edit'
      );
    }
    return res.ok();
  },
  create: function create(req, res) {
    if (!res.locals.data) res.locals.data = {};

    req.we.utils._.merge(res.locals.data, req.query);

    if (req.method === 'POST') {
      if(req.isAuthenticated()) req.body.creatorId = req.user.id;
      req.body.eventId = res.locals.event.id;
      req.body.cfmenuId = req.params.cfmenuId;
      // set temp record for use in validation errors
      res.locals.data = req.query;
      req.we.utils._.merge(res.locals.record, req.body);

      return res.locals.Model.create(req.body)
      .then(function (record) {
        res.locals.data = record;
        if (req.accepts('html')) {
          return res.redirect(
            '/event/' + res.locals.event.id + '/admin/cfmenu/' + req.params.cfmenuId+ '/edit'
          );
        }

        res.created();
      }).catch(res.queryError);
    } else {
      res.locals.data = req.query;
      res.ok();
    }
  },
  edit: function edit(req, res) {
    if (!res.locals.data) return res.notFound();

    if (req.method === 'POST') {
      // dont change event id for registration type
      if (req.isAuthenticated()) req.body.creatorId = req.user.id;
      req.body.eventId = res.locals.event.id;
      req.body.cfmenuId = req.params.cfmenuId;

      res.locals.data.updateAttributes(req.body)
      .then(function() {
        if (req.accepts('html')) {
          return res.redirect(
            '/event/' + res.locals.event.id + '/admin/cfmenu/' + req.params.cfmenuId+ '/edit'
          );
        }

        res.created();
      }).catch(res.queryError);
    } else {
      res.ok();
    }
  },
  sortLinks: function sortLinks(req, res) {
    var redirectTo = req.we.utils.getRedirectUrl(req, res);
    if (redirectTo) res.locals.redirectTo = redirectTo;

    if (!req.body) {
      if (redirectTo) return res.redirect(redirectTo);
      return res.send();
    }

    req.we.db.models.cfmenu.findOne({
      where: { id: req.params.cfmenuId}, include: { all: true }
    }).then(function (cfmenu) {
      if (!cfmenu) return res.notFound();

      var itensToSave = {};
      var linkAttrs;

      for (var item in req.body) {
        linkAttrs = item.split('-');

        if (linkAttrs.length !== 3) continue;
        if (linkAttrs[0] !== 'link') continue;
        if (req.we.utils._.isNumber(linkAttrs[1])) continue;
        if (linkSortAttrs.indexOf(linkAttrs[2]) === -1) continue;

        if (!itensToSave[linkAttrs[1]]) itensToSave[linkAttrs[1]] = {};

        itensToSave[linkAttrs[1]][linkAttrs[2]] = req.body[item];
      }

      req.we.utils.async.each(cfmenu.links, function(link, next) {
        if (!itensToSave[link.id]) return next();

        link.updateAttributes(itensToSave[link.id])
        .then(function() {
          next();
        }).catch(next);
      }, function(err) {
        if (err) return res.serverError(err);
        if (redirectTo) return res.redirect(redirectTo);
        res.send();
      });
    }).catch(res.queryError);
  }
};