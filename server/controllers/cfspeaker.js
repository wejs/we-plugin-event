module.exports = {
  find: function find(req, res, next) {
    res.locals.query.order = [ ['weight','ASC'], ['createdAt','ASC'] ];
    return res.locals.Model.findAndCountAll(res.locals.query)
    .then(function (record) {
      if (!record) return next();

      res.locals.metadata.count = record.count;
      res.locals.data = record.rows;

      return res.ok();
    });
  }
};