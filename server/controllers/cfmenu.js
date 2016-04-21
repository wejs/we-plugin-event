module.exports = {
  findOne: function findOne(req, res, next) {
    if (!res.locals.data) return next();

    if (req.accepts('html')) {
      return res.goTo(
        '/event/' + res.locals.event.id + '/admin/cfmenu/' + req.params.cfmenuId+ '/edit'
      );
    }

    return res.ok();
  }
};