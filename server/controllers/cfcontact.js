var _ = require('lodash');

module.exports = {

  create: function create(req, res) {
    if (!res.locals.template) res.locals.template = res.locals.model + '/' + 'create';

    if (!res.locals.record) res.locals.record = {};

    _.merge(res.locals.record, req.query);

    if (req.method === 'POST') {
      if (req.isAuthenticated()) req.body.creatorId = req.user.id;

      res.locals.messageSend = false;
      // set temp record for use in validation errors
      res.locals.record = req.query;
      _.merge(res.locals.record, req.body);

      return res.locals.Model.create(req.body)
      .then(function (record) {
        res.locals.record = record;
        res.locals.messageSend = true;

        var we = req.getWe();
        var templateVariables = {
          user: record,
          site: {
            name: we.config.appName,
            url: we.config.hostname
          }
        };
        var options = {
          email: record.email,
          subject: req.__('cfcontact.email.subject', templateVariables),
          from: res.locals.conference.title + ' <' + res.locals.conference.email  + '>'
        };

        we.email.sendEmail('CFContactSuccess', options, templateVariables, function (err) {
          if (err) {
            we.log.error('Action:CFContactSuccess sendEmail:', err);
          }
        });

        req.flash('messages',[{
          status: 'success',
          type: 'updated',
          message: req.__('cfcontact.email.success')
        }]);

        res.redirect('/');
      }).catch(res.queryError);
    } else {
      res.locals.record = req.query;

      if (req.isAuthenticated()) {
        res.locals.record.name = req.user.displayName;
        res.locals.record.email = req.user.email;
      }

      res.status(200);
      res.ok();
    }
  }

};