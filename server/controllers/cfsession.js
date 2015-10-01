module.exports = {
  find: function findAll(req, res, next) {
    var we = req.getWe();

    if (res.locals.query.order == 'createdAt DESC') {
      res.locals.query.order = [ ['startDate', 'ASC'], ['createdAt', 'ASC'] ];
    }

    res.locals.query.include = [
      { model: we.db.models.cftopic, as: 'topic' },
      { model: we.db.models.cfroom, as: 'room' },
      { model: we.db.models.user, as: 'user' }
    ];

    // filter by creator if have userId param
    if (req.params.userId)
      res.locals.query.where.userId = req.params.userId;

    return res.locals.Model.findAndCountAll(res.locals.query).then(function (record) {
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

    req.we.utils._.merge(res.locals.record, req.query);

    if (req.method === 'POST') {
      if (req.isAuthenticated()) req.body.userId = req.user.id;

      // set temp record for use in validation errors
      res.locals.record = req.query;
      req.we.utils._.merge(res.locals.record, req.body);

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

  /**
   * Route to current user register in event
   */
  addRegistration: function addRegistration(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();
    if (!req.body.cfsessionId) {
      req.flash('messages',[{
        status: 'warning',
        message: req.__('cfsession.registration.cfsessionIsRequired')
      }]);
      return res.goTo((res.locals.redirectTo || '/'));
    }
    // user not is registered in current event
    if (
      !res.locals.userCfregistration ||
      (res.locals.userCfregistration.status != 'registered')
    ) {
      res.addMessage('error', 'cfsession.addRegistration.user.not.in.event');
      return res.goTo((res.locals.redirectTo || '/'));
    }

    var we = req.getWe();

    // register in one session
    we.db.models.cfsession.findOne({
      where: { id: req.body.cfsessionId },
      include: [
        { model: we.db.models.cfroom, as: 'room' },
        { model: we.db.models.cfregistration, as: 'subscribers' }
      ]
    }).then(function (session) {
      if (!session) return res.notFound();

      if (!session.haveVacancy) {
        res.addMessage('warning', 'cfsession.not.haveVacancy');
        return res.goTo((res.locals.redirectTo || '/'));
      }
      // add the subscriber
      session.addSubscribers(res.locals.userCfregistration)
      .then(function() {
        var user = req.user.toJSON();

        var templateVariables = {
          user: user,
          event: res.locals.event,
          cfsession: session,
          site: {
            name: we.config.appName,
            url: we.config.hostname
          }
        };
        // Node.js is do queries in async then to other check if have vacancy
        session.getSubscriberCount().then(function (count) {
          // if have more subscribers than vacancy, rollback
          if (count > session.vacancy) {
            return session.removeSubscribers(res.locals.userCfregistration)
            .then(function(){
              res.addMessage('warning', 'cfsession.not.haveVacancy');
              return res.goTo((res.locals.redirectTo || '/'));
            }).catch(res.queryError);
          }

          // if success send the confirmation message
          we.email.sendEmail('CFSessionRegisterSuccess', {
            email: req.user.email,
            subject: req.__('cfsession.addRegistration.success.email') + ' - ' + res.locals.event.abbreviation,
            replyTo: res.locals.event.title + ' <'+res.locals.event.email+'>'
          }, templateVariables, function(err , emailResp){
            if (err) {
              we.log.error('Error on send email CFSessionRegisterSuccesss', err, emailResp);
            }
          });

          req.flash('messages',[{
            status: 'success',
            type: 'updated',
            message: req.__('cfsession.addRegistration.success')
          }]);
          res.goTo((res.locals.redirectTo || '/'));
        }).catch(req.queryError);

      }).catch(req.queryError);
    }).catch(req.queryError);
  },

  removeRegistration: function removeRegistration(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();
    if (!req.body.cfsessionId) {
      req.flash('messages',[{
        status: 'warning',
        message: req.__('cfsession.registration.cfsessionIsRequired')
      }]);
      return res.goTo((res.locals.redirectTo || '/'));
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

            res.goTo((res.locals.redirectTo || '/'));
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
        res.goTo((res.locals.redirectTo || '/'));

      }).catch(req.queryError);
    }
  },

  subscribers: function subscribers(req, res) {
    res.locals.Model.findOne({
      where: { id: req.params.cfsessionId }
    }).then(function (r) {
      if (!r) return res.notFound();

      res.locals.title = r.title;

      res.locals.record = r;
      r.getSubscribers({
        include: [
          { model: req.we.db.models.user, as: 'user'}
        ]
      }).then(function (s) {
        res.locals.record.subscribers = s;
        res.ok();
      }).catch(res.queryError);
    }).catch(res.queryError);
  },

  /**
   * Return cfsession subscribers in csv format
   *
   */
  exportSubscribers: function exportSubscribers(req, res) {
    var format = ( (req.user && req.user.language) || req.we.config.date.defaultFormat);

    res.locals.Model.findOne({
      where: { id: req.params.cfsessionId }
    }).then(function (r) {
      if (!r) return res.notFound();
      // add user association
      res.locals.query.include = [ { model: req.we.db.models.user, as: 'user'} ];
      // sort by fullName by default
      if (!req.query.notSortByFullName) {
        res.locals.query.order = [[
          { model: req.we.db.models.user, as: 'user' },
          'fullName', 'ASC'
        ]];
      }

      delete res.locals.query.limit;

      res.locals.record = r;
      r.getSubscribers(res.locals.query).then(function (s) {
        res.locals.record.subscribers = s;

        var subscriptions = s.map(function (i) {
          return {
            id: i.id,
            userId: i.user.id,
            displayName: i.user.displayName,
            fullName: i.user.fullName,
            email: i.user.email,
            createdAt: req.we.utils.moment(i.createdAt).format(format)
          }
        });

        req.we.csv.stringify(subscriptions, {
          header: true,
          quotedString: true,
          columns: {
            id: 'id',
            userId: 'userId',
            displayName: 'displayName',
            fullName: 'fullName',
            email: 'email',
            createdAt: 'createdAt'
          }
        }, function (err, data) {
          if (err) return res.serverError(err);
          var fileName = 'subscriptions-export-' +
            res.locals.event.id + '-'+
            req.params.cfsessionId + '-'+
            new Date().getTime() + '.csv';

          res.setHeader('Content-disposition', 'attachment; filename='+fileName);
          res.set('Content-Type', 'application/octet-stream');
          res.send(data);
        });

      }).catch(res.queryError);
    }).catch(res.queryError);
  },

  markAllAsPresent: function markAllAsPresent(req, res) {
    req.we.db.models.cfsessionSubscriber.update({
      present: true
    }, {
      where: {
        cfsessionId: req.params.cfsessionId,
        present: false
      }
    }).then(function (r) {
      res.locals.metadata = r[0];

      if (req.body.redirectTo) {
        res.addMessage('success', 'cfsession.markAllAsPresent.success');
        res.goTo(req.body.redirectTo);
      } else {
        return res.send(res.locals.metadata);
      }
    }).catch(res.queryError);
  }
};