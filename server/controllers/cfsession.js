var _ = require('lodash');

module.exports = {
  find: function findAll(req, res, next) {
    var we = req.getWe();

    res.locals.query.order = [ ['startDate', 'ASC'], ['createdAt', 'ASC'] ];

    res.locals.query.include = [{ all: true}];

    // filter by creator if are have userId param
    if (req.params.userId)
      res.locals.query.where.userId = req.params.userId;

    return res.locals.Model.findAndCountAll(res.locals.query)
    .then(function (record) {
      if (!record) return next();

      var activeSet = false;

      res.locals.metadata.count = record.count;
      res.locals.record = record.rows;

      res.locals.days = {};
      var nodayString = req.__('cfsession.no.date');

      res.locals.record.forEach(function (r) {
        if (!r.startDate) return;
        var sdate = we.utils.moment(r.startDate)
        var day;

        if (we.utils.moment(r.startDate).isValid()) {
          day = sdate.locale(we.config.i18n.defaultLocale).format('L');
        } else {
          day = nodayString
        }

        if (!res.locals.days[day]) {
          res.locals.days[day] = {
            text: day,
            cfsession: []
          };

          if (!activeSet && day != nodayString) {
            res.locals.days[day].active = true;
            activeSet = true;
          }
        }

        res.locals.days[day].cfsession.push(r);
      });

      // reorder nodaystring
      if (res.locals.days[nodayString]) {
        var reord = res.locals.days[nodayString];
        delete res.locals.days[nodayString];
        res.locals.days[nodayString] = reord;
      }

      return res.ok();
    });
  },

  create: function create(req, res) {
    if (!res.locals.template) res.locals.template = res.locals.model + '/' + 'create';

    if (!res.locals.record) res.locals.record = {};

     _.merge(res.locals.record, req.query);

    if (req.method === 'POST') {
      if (req.isAuthenticated()) req.body.userId = req.user.id;

      // set temp record for use in validation errors
      res.locals.record = req.query;
      _.merge(res.locals.record, req.body);

      return res.locals.Model.create(req.body)
      .then(function (record) {
        res.locals.record = record;
        res.created();
      }).catch(res.queryError);
    } else {
      res.locals.record = req.query;
      res.ok();
    }
  },

  addRegistration: function (req, res) {
    if (!req.isAuthenticated()) return res.forbidden();
    if (!req.body.cfsessionId) {
      req.flash('messages',[{
        status: 'warning',
        message: req.__('cfsession.registration.cfsessionIsRequired')
      }]);
      return res.redirect((res.locals.redirectTo || '/'));
    }

    var we = req.getWe();

    // register in one session
    we.db.models.cfsession.findById(req.body.cfsessionId).then(function (session){
      if (!session) return res.notFound();
        session.addSubscribers(res.locals.userCfregistration)
        .then(function() {

          var options = {
            email: req.user.email,
            subject: req.__('cfsession.addRegistration.success.email') + ' - ' + res.locals.conference.abbreviation,
            from: res.locals.conference.title + ' <'+res.locals.conference.email+'>'
          };

          user = req.user.toJSON();

          var templateVariables = {
            user: user,
            conference: res.locals.conference,
            cfsession: session,
            site: {
              name: we.config.appName,
              url: we.config.hostname
            }
          };

          we.email.sendEmail('CFSessionRegisterSuccess', options, templateVariables, function(err , emailResp){
            if (err) {
              we.log.error('Error on send email CFSessionRegisterSuccesss', err, emailResp);
              return res.serverError();
            }

            we.log.info('AuthResetPasswordEmail: Email resp:', emailResp);

            req.flash('messages',[{
              status: 'success',
              type: 'updated',
              message: req.__('cfsession.addRegistration.success')
            }]);
            res.redirect((res.locals.redirectTo || '/'));
          });
      }).catch(req.queryError);
    }).catch(req.queryError);
  },

  removeRegistration: function (req, res) {
    if (!req.isAuthenticated()) return res.forbidden();
    if (!req.body.cfsessionId) {
      req.flash('messages',[{
        status: 'warning',
        message: req.__('cfsession.registration.cfsessionIsRequired')
      }]);
      return res.redirect((res.locals.redirectTo || '/'));
    }

    var we = req.getWe();

    if (req.body.cfsessionId) {
      // un register from one
      we.db.models.cfsession.findById(req.body.cfsessionId).then(function (session){
        if (!session) return res.notFound();
          session.removeSubscribers(res.locals.userCfregistration)
          .then(function() {

            req.flash('messages',[{
              status: 'success',
              type: 'updated',
              message: req.__('cfsession.removeRegistration.success')
            }]);

            res.redirect((res.locals.redirectTo || '/'));
        }).catch(req.queryError);
      }).catch(req.queryError);
    } else {
      // unregister from all
      res.locals.userCfregistration.setSessions([]).then(function() {
        req.flash('messages',[{
          status: 'success',
          type: 'updated',
          message: req.__('cfsession.removeRegistration.success')
        }]);
        res.redirect((res.locals.redirectTo || '/'));

      }).catch(req.queryError);
    }
  }
};