module.exports = {
  find(req, res) {
    const we = req.we;

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

    res.locals.Model
    .findAll(res.locals.query)
    .then(function count(record) {
      return res.locals.Model
      .count(res.locals.query)
      .then(function afterCount(count) {
        res.locals.metadata.count = count;
        return record;
      });
    })
    .then(function afterFind(record) {
      res.locals.data = record;

      let activeSet = false;

      res.locals.days = {};
      let nodayString = req.__('cfsession.no.date');

      res.locals.data.forEach(function (r) {
        if (!r.startDate) return;
        let sdate = we.utils.moment(r.startDate)
        let day;

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
        let reord = res.locals.days[nodayString];
        delete res.locals.days[nodayString];
        res.locals.days[nodayString] = reord;
      }

      res.ok();
    })
    .catch(req.queryError);
  },

  create(req, res) {
    if (!res.locals.template) res.locals.template = res.locals.model + '/' + 'create';

    if (!res.locals.data) res.locals.data = {};

    if (req.method === 'POST') {
      if (req.isAuthenticated()) req.body.userId = req.user.id;
      // set temp record for use in validation errors
      req.we.utils._.merge(res.locals.data, req.body);

      res.locals.Model
      .create(req.body)
      .then(function afterCreate(record) {
        res.locals.data = record;
        res.created();
      })
      .catch(res.queryError);
    } else {
      res.ok();
    }
  },

  /**
   * Route to current user register in event
   */
  addRegistration(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();
    if (!req.body.cfsessionId) {
      // cfsessionId is required
      res.addMessage('warning', 'cfsession.registration.cfsessionIsRequired');
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

    const we = req.we,
      models = we.db.models;

    // register in one session
    models.cfsession.findOne({
      where: { id: req.body.cfsessionId },
      include: [
        { model: models.cfroom, as: 'room' },
        { model: models.cfregistration, as: 'subscribers' }
      ]
    })
    .then(function afterFindSession(session) {
      if (!session) return res.notFound();

      if (!session.haveVacancy) {
        res.addMessage('warning', 'cfsession.not.haveVacancy');
        return res.goTo((res.locals.redirectTo || '/'));
      }

      // add the subscriber
      return session
      .addSubscribers(res.locals.userCfregistration)
      .then(function afterAddSubscribers() {
        const user = req.user.toJSON();

        let appName = we.config.appName;

        if (we.systemSettings && we.systemSettings.siteName) {
          appName = we.systemSettings.siteName;
        }

        let templateVariables = {
          email: user.email,
          name: user.name,
          eventId: res.locals.event.id,
          eventTitle: res.locals.event.title,
          siteName: appName,
          siteUrl: we.config.hostname,
          cfsessionTitle: session.title,

          cfsession: session,
          cf: res.locals.event
        };

        // Node.js is do queries in async then to other check if have vacancy
        return session
        .getSubscriberCount()
        .then(function afterGetSubscriberCount(count) {
          // if have more subscribers than vacancy, rollback
          if (count > session.vacancy) {
            return session.removeSubscribers(
              res.locals.userCfregistration
            )
            .then(function afterRollback() {
              res.addMessage('warning', 'cfsession.not.haveVacancy');
              res.goTo((res.locals.redirectTo || '/'));
            });
          }

          // if success send the confirmation message
          we.email.sendEmail('CFSessionRegisterSuccess', {
            email: req.user.email,
            replyTo: res.locals.event.title + ' <'+res.locals.event.email+'>'
          }, templateVariables, function(err , emailResp) {
            if (err) {
              we.log.error('Error on send email CFSessionRegisterSuccesss', err, emailResp);
            }
          });

          res.addMessage('success', 'cfsession.addRegistration.success');

          if (!res.locals.redirectTo && res.locals.event) {
            res.goTo('/event/'+res.locals.event.id+'/register');
          } else {
            res.goTo(res.locals.redirectTo || '/');
          }

        });
      });
    })
    .catch(req.queryError);
  },

  removeRegistration(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();

    const we = req.we;

    if (req.body.cfsessionId) {
      // un register from one
      we.db.models.cfsession
      .findOne({
        where: { id: req.body.cfsessionId }
      })
      .then( function afterFind(session) {
        if (!session) return res.notFound();
        return session.removeSubscribers(res.locals.userCfregistration)
        .then(function afterUnsubscribe() {
          res.addMessage('success', 'cfsession.removeRegistration.success');


          if (!res.locals.redirectTo && res.locals.event) {
            res.goTo('/event/'+res.locals.event.id+'/register');
          } else {
            res.goTo(res.locals.redirectTo || '/');
          }
        });
      })
      .catch(req.queryError);
    } else {
      // unregister from all
      res.locals.userCfregistration
      .setSessions([])
      .then(function afterUnsubscribe() {
        res.addMessage('success', 'cfsession.removeRegistration.success');
        res.goTo((res.locals.redirectTo || '/'));
      })
      .catch(req.queryError);
    }
  },

  subscribers(req, res) {
    res.locals.Model.findOne({
      where: { id: req.params.cfsessionId }
    })
    .then(function afterFindOne(r) {
      if (!r) return res.notFound();

      res.locals.title = r.title;

      res.locals.data = r;
      return r.getSubscribers({
        include: [
          { model: req.we.db.models.user, as: 'user'}
        ]
      })
      .then(function afterLoadSubscribers(s) {
        res.locals.data.subscribers = s;
        res.ok();
      });
    })
    .catch(res.queryError);
  },

  /**
   * Return cfsession subscribers in csv format
   *
   */
  exportSubscribers(req, res) {
    const format = ( (req.user && req.user.language) || req.we.config.date.defaultFormat);

    res.locals.Model.findOne({
      where: { id: req.params.cfsessionId }
    })
    .then(function afterFindSession(r) {
      if (!r) return res.notFound();
      // add user association
      res.locals.query.include = [
        { model: req.we.db.models.user, as: 'user'}
      ];
      // sort by fullName by default
      if (!req.query.notSortByFullName) {
        res.locals.query.order = [[
          { model: req.we.db.models.user, as: 'user' },
          'fullName', 'ASC'
        ]];
      }

      delete res.locals.query.limit;

      res.locals.data = r;
      return r
      .getSubscribers( res.locals.query )
      .then( function afterLoadSubscribers(s) {
        res.locals.data.subscribers = s;

        let subscriptions = s.map(function (i) {
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
          let fileName = 'subscriptions-export-' +
            res.locals.event.id + '-'+
            req.params.cfsessionId + '-'+
            new Date().getTime() + '.csv';

          res.setHeader('Content-disposition', 'attachment; filename='+fileName);
          res.set('Content-Type', 'application/octet-stream');
          res.send(data);
        });

      });
    })
    .catch(res.queryError);
  },

  markAllAsPresent(req, res) {
    req.we.db.models.cfsessionSubscriber
    .update({
      present: true
    }, {
      where: {
        cfsessionId: req.params.cfsessionId,
        present: false
      }
    })
    .then(function (r) {
      res.locals.metadata = r[0];

      if (req.body.redirectTo) {
        res.addMessage('success', 'cfsession.markAllAsPresent.success');
        res.goTo(req.body.redirectTo);
      } else {
        res.send(res.locals.metadata);
      }
    })
    .catch(res.queryError);
  }
};