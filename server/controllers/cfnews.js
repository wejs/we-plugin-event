module.exports = {
  create(req, res) {
    const we = req.we;

    if (!res.locals.data) res.locals.data = {};

    if (req.method === 'POST') {

      if(req.isAuthenticated()) req.body.creatorId = req.user.id;
      req.body.eventId = req.params.eventId;

      we.utils._.merge(res.locals.data, req.body);

      return res.locals.Model
      .create(req.body)
      .then(function afterCreate(record) {
        res.locals.data = record;

        if (req.accepts('html')) {
          // push id to paramsArray for use in urlTo
          req.paramsArray.push(record.id);
          // redirect to content after create
          return res.goTo(we.router.urlTo('cfnews.findOne', req.paramsArray));
        }

        res.created();
      })
      .catch(res.queryError);
    } else {
      res.ok();
    }
  },
  edit(req, res) {
    if (!res.locals.data) return res.notFound();

    const we = req.we;

    if (req.method == 'POST' || req.method == 'PUT') {
      // dont change eventId in edit
      delete req.body.eventId;

      res.locals.data
      .updateAttributes(req.body)
      .then(function afterUpdate() {
        if (req.accepts('html')) {
          // push id to paramsArray for use in urlTo
          req.paramsArray.push(res.locals.data.id);
          // redirect to content after create
          return res.goTo(we.router.urlTo('cfnews.findOne', req.paramsArray));
        }
        res.updated();
      });
    } else {
      res.ok();
    }
  },
  managePage(req, res, next) {
    // send to find action, this allows to set custom permissions and template for this action but with find logic
    req.we.controllers.cfnews.find(req, res, next);
  }
};