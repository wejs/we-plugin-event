module.exports = {
  find(req, res) {
    res.locals.query.where.eventId = res.locals.event.id;

    res.locals.Model
    .findAll(res.locals.query)
    .then(function afterFind(record) {
      res.locals.data = record;

      return res.locals.Model
      .count(res.locals.query)
      .then(function afterCount(count) {

        res.locals.metadata.count = count;
        res.ok();
      });
    })
    .catch(res.queryError);
  },
  managePage(req, res, next) {
    // send to find action, this allows to set custom permissions and template for this action but with find logic
    req.we.controllers.cfpage.find(req, res, next);
  }
};