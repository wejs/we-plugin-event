module.exports = {
  find: function find(req, res) {
    res.locals.query.order = [ ['weight','ASC'], ['createdAt','ASC'] ];
    return res.locals.Model.findAll(res.locals.query)
    .then(function aferFind(record) {
      res.locals.data = record.rows;

      return res.locals.Model.count(res.locals.query)
      .then(function aferCount(count) {

        res.locals.metadata.count = count;
        return res.ok();

      }).catch(req.queryError);
    }).catch(req.queryError);
  }
};