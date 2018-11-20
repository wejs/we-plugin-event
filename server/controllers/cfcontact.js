module.exports = {
  create(req, res, done) {
    if (!res.locals.template) res.locals.template = res.locals.model + '/' + 'create';

    if (!res.locals.data) res.locals.data = {};

    const we = req.we;

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
        .then(function afterCreate(record) {
          res.locals.data = record;
          res.locals.messageSend = true;

          let appName = we.config.appName;

          if (we.systemSettings && we.systemSettings.siteName) {
            appName = we.systemSettings.siteName;
          }

          let templateVariables = {
            email: record.email,
            name: record.name,
            message: record.message,
            eventId: res.locals.event.id,
            eventTitle: res.locals.event.title,
            siteName: appName,
            siteUrl: we.config.hostname,

            cf: res.locals.event,
            cfcontact: record
          };

          we.email.sendEmail('CFContactSuccess', {
            email: record.email,
            replyTo: res.locals.event.title + ' <' + res.locals.event.email  + '>'
          }, templateVariables, function (err) {
            if (err) {
              we.log.error('Action:CFContactSuccess sendEmail:', err);
            }
          });

          we.email.sendEmail('CFContactNewMessage', {
            email: res.locals.event.email,
            replyTo: record.name + ' <' + record.email  + '>'
          }, templateVariables, function (err) {
            if (err) {
              we.log.error('Action:CFContactSuccess sendEmail:', err);
            }
          });

          res.addMessage('success', {
            text: 'cfcontact.email.success'
          });

          if (res.locals.event) {
            res.goTo('/event/'+res.locals.event.id);
          } else {
            res.goTo('/');
          }
        })
        .catch(res.queryError);
      });
    } else {
      res.locals.data = {};

      if (req.isAuthenticated()) {
        res.locals.data.name = req.user.displayName;
        res.locals.data.email = req.user.email;
      }

      res.status(200);
      res.ok();
    }
  }
};