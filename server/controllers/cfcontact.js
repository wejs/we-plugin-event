module.exports = {
  create: function create(req, res, done) {
    if (!res.locals.template) res.locals.template = res.locals.model + '/' + 'create';

    if (!res.locals.data) res.locals.data = {};

    if (req.method === 'POST') {
      req.we.antiSpam.recaptcha.verify(req, res, function afterCheckSpam(err, isSpam) {
        if (err) return done(err);

        if (isSpam) {
          req.we.log.warn('cfmessage.create: spambot found in recaptcha verify: ', req.ip, req.body.email);

          res.addMessage('warning', {
            text: 'auth.register.spam',
            vars: { email: req.body.email }
          });

          return res.queryError();
        }

        if (req.isAuthenticated()) req.body.creatorId = req.user.id;
        req.body.eventId = res.locals.event.id;

        res.locals.messageSend = false;
        // set temp record for use in validation errors
        res.locals.data = req.query;
        req.we.utils._.merge(res.locals.record, req.body);

        return res.locals.Model.create(req.body)
        .then(function (record) {
          res.locals.data = record;
          res.locals.messageSend = true;

          var we = req.getWe();
          var templateVariables = {
            cfcontact: record,
            event: res.locals.event,
            site: {
              name: we.config.appName,
              url: we.config.hostname
            }
          };

          we.email.sendEmail('CFContactSuccess', {
            email: record.email,
            subject: req.__('cfcontact.email.subject', templateVariables),
            replyTo: res.locals.event.title + ' <' + res.locals.event.email  + '>'
          }, templateVariables, function (err) {
            if (err) {
              we.log.error('Action:CFContactSuccess sendEmail:', err);
            }
          });
          we.email.sendEmail('CFContactNewMessage', {
            email: res.locals.event.email,
            subject: req.__('cfcontact.new.email.subject', templateVariables),
            replyTo: record.name + ' <' + record.email  + '>'
          }, templateVariables, function (err) {
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
      });
    } else {
      res.locals.data = req.query;

      if (req.isAuthenticated()) {
        res.locals.data.name = req.user.displayName;
        res.locals.data.email = req.user.email;
      }

      res.status(200);
      res.ok();
    }
  }

};