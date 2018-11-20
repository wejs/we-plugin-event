const PDFDocument = require('pdfkit');

const registrationFields  = [
  'registrationId'+
  'userId'+
  'email'+
  'displayName'+
  'fullName'+
  'status'+
  'registrationDate'
];

module.exports = {
  create(req, res) {
    if (!res.locals.template) res.locals.template = res.locals.model + '/' + 'create';

    if (!res.locals.data) res.locals.data = {};

    req.we.db.models.cfregistrationtype
    .findAll({
      where: { eventId: res.locals.event.id }
    })
    .then(function afterLoadRegistrationTypes(cfrts) {
      res.locals.cfregistrationtypes = cfrts;

      if (req.method === 'POST') {
        return req.we.db.models.cfregistration.findOne({
          where: {
            userId: req.body.userId,
            eventId: res.locals.event.id
          }
        })
        .then(function afterCheckIfAreRegistered(r) {
          // this user is already registered in any registration type
          if (r) {
            res.addMessage('warn', {
              text: 'cfregistration.create.user.registered'
            });
            return res.ok();
          }

          req.body.eventId = res.locals.event.id;

          return res.locals.Model
          .create(req.body)
          .then(function afterCreate(record) {
            res.locals.data = record;

            res.addMessage('success', {
              text: 'cfregistration.create.success',
              vars: { record: record }
            });

            res.created();
          });
        });
      } else {
        res.ok();
      }
    })
    .catch(req.queryError);
  },

  register(req, res, next) {
    const we = req.we;

    if (!res.locals.data) res.locals.data = {};

    we.db.models.cfregistrationtype
    .findAll({
      where: { eventId: res.locals.event.id }
    })
    .then(function afterLoadCRT(r) {
      res.locals.cfregistrationtypes = r;

      if (!r || !r.length) {
        res.locals.registrationClosedInfo = req.__('event.registration.closed');
        res.locals.template = 'cfregistration/registration-closed';
        return res.ok();
      } else {
        if (res.locals.userCfregistration) {
          for (var i = 0; i < r.length; i++) {
            if (r[i].id === res.locals.userCfregistration.id) {
              r[i].checked = true;
              break;
            }
          }
        }
      }

      // show my registration page is are registered
      if (req.isAuthenticated() && res.locals.userCfregistration) {
        return we.controllers.cfregistration.myRegistrationPage(req, res, next);
      }

      // return to event and show error message if event not is open
      if (res.locals.event.registrationStatus != 'open') {
        res.addMessage('error', 'event.'+res.locals.event.registrationStatus);
        return res.goTo('/event/'+ res.locals.event.id);
      }

      if (!req.isAuthenticated()) {
        // only authenticated
        res.locals.template = 'cfregistration/registration-unAuthenticated';
        return res.ok();
      }

      if (r.length === 1) r[0].checked = true;

      if (req.method === 'POST') {
        // save the registration
        return saveUserRegistration(req, res);
      } else {
        // send the registration form
        if (!req.body) req.body = {};

        if (!req.body.certificationName)
          res.locals.data.certificationName = (req.user.fullName || req.user.displayName);
        if (!req.body.userEmail)
          res.locals.data.userEmail = req.user.email;

        res.ok();
      }
    })
    .catch(res.queryError);
  },
  unRegister(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();
    const we = req.we;

    res.locals.deleteMsg = req.__('cfregistration.unRegister.confirm.msg');

    res.locals.deleteRedirectUrl = we.router.urlTo(
      'event.findOne', [res.locals.event.id], we
    );

    if (req.method === 'POST' || req.method === 'DELETE') {
      if (res.locals.userCfregistration) {
        res.locals.userCfregistration
        .destroy()
        .then(function afterDeleteUserCfRegistration() {
          res.goTo(we.router.urlTo(
            'event.findOne', [res.locals.event.id], we
          ));
        })
        .catch(res.queryError);
      } else {
        res.goTo(we.router.urlTo(
          'event.findOne', [res.locals.event.id], we
        ));
      }
    } else {
      res.ok();
    }
  },
  /**
   * My registration page, Part of registration action
   */
  myRegistrationPage(req, res) {
    const we = req.we;

    res.locals.title = req.__('event.registered');

    res.locals.template =
      'cfregistration/' + res.locals.userCfregistration.status;
    // get sessions to user subscribe
    return we.db.models.cfsession
    .findAll({
      where: {
        eventId: res.locals.event.id,
        requireRegistration: 1
      },
      include: [
        { model: we.db.models.cftopic, as: 'topic' },
        { model: we.db.models.cfroom, as: 'room' },
        { model: we.db.models.cfregistration, as: 'subscribers' }
      ]
    })
    .then(function afterLoadSessions(cfsessions) {
      res.locals.userCfregistration
      .getSessions()
      .then(function(s) {
        res.locals.sessionsToRegister = cfsessions.filter(function (r){
          r.conflict = r.haveTimeConflict(s);

          if (!s) return true;

          // check if is registered
          for (var i = 0; i < s.length; i++) {
            if (s[i].id == r.id) {
              return false;
            }
          }
          return true;
        });

        res.locals.userCfregistration.sessions = s;
        return res.ok();
      });
    })
    .catch(res.queryError);
  },
  edit(req, res) {
    if (!res.locals.data) return res.notFound();
    const we = req.we;

    we.db.models.cfregistrationtype
    .findAll({
      where: { eventId: res.locals.event.id }
    })
    .then(function afterLoadCFRT(r) {
      res.locals.cfregistrationtypes = r;

      for (let i = 0; i < r.length; i++) {
        if (r[i].id === res.locals.data.id) {
          r[i].checked = true;
          break;
        }
      }

      if (req.method === 'POST' || req.method === 'PUT') {
        // dont change event id for registration type
        delete req.body.eventId;

        res.locals.data
        .updateAttributes(req.body)
        .then(function afterUpdate() {
          res.updated();
        })
        .catch(res.queryError);

      } else {
        res.ok();
      }
    })
    .catch(res.queryError);
  },
  accept(req, res) {
    res.locals.Model
    .findOne({
      where: {
        id: req.params.cfregistrationId,
        eventId: res.locals.event.id
      }
    })
    .then(function afterFind(record) {
      if (!record) return res.notFound();
      res.locals.data = record;

      record.status = 'registered';
      return record
      .save()
      .then(function afterSave() {

        // TODO send confirmation email to user

        res.ok();
      });
    }).catch(res.queryError);
  },
  /**
   * Export event registration list
   */
  exportRegistration (req, res){
    const we = req.we;

    if (!we.plugins['we-plugin-csv']) {
      return res.serverError('we-plugin-event:we-plugin-csv plugin is required for export registrations');
    }

    let order = ' order by fullName ASC ';
    // valid and parse orderby
    if (req.query.order) {
      let orderParams = req.query.order.split(' ');
      if (orderParams.length == 2) {
        if ( (orderParams[1] =='ASC') || (orderParams[1] == 'DESC') ) {
          if (registrationFields.indexOf(orderParams[0])) {
            order = ' order by '+req.query.order;
          }
        }
      }
    }

    let sql = 'SELECT '+
      'cfregistrations.id as registrationId, '+
      'cfregistrations.userId, '+
      'u.email, '+
      'u.displayName, '+
      'u.fullName, '+
      'cfregistrations.status, '+
      'cfregistrations.createdAt AS registrationDate '+
    'FROM cfregistrations '+
    'INNER JOIN users AS u ON u.id=cfregistrations.userId '+
    'WHERE cfregistrations.eventId='+ res.locals.event.id+
    '   AND cfregistrations.status="registered" '+
    order;

    we.db.defaultConnection
    .query(sql
      , { type: we.db.defaultConnection.QueryTypes.SELECT }
    )
    .then(function afterGetCFRegistrations(results) {

      res.locals.csvResponseColumns = {
        registrationId: 'registrationId',
        userId: 'userId',
        email: 'email',
        displayName: 'displayName',
        fullName: 'fullName',
        status: 'status',
        registrationDate: 'registrationDate'
      };

      res.locals.data = results;

      res.ok();
    })
    .catch(res.queryError);
  },
  exportRegistrationUserTags(req, res){
    const we = req.we;

    let order = ' order by fullName ASC ';
    // valid and parse orderby
    if (req.query.order) {
      let orderParams = req.query.order.split(' ');
      if (orderParams.length == 2) {
        if ( (orderParams[1] =='ASC') || (orderParams[1] == 'DESC') ) {
          if (registrationFields.indexOf(orderParams[0])) {
            order = ' order by '+req.query.order;
          }
        }
      }
    }

    let sql = 'SELECT '+
      'cfregistrations.id as registrationId, '+
      'cfregistrations.userId, '+
      'u.email, '+
      'u.displayName, '+
      'u.fullName, '+
      'cfregistrations.status, '+
      'cfregistrations.createdAt AS registrationDate '+
    'FROM cfregistrations '+
    'INNER JOIN users AS u ON u.id=cfregistrations.userId '+
    'WHERE cfregistrations.eventId='+ res.locals.event.id+
    '   AND cfregistrations.status="registered" '+
    order;

    we.db.defaultConnection
    .query(sql
      , { type: we.db.defaultConnection.QueryTypes.SELECT }
    )
    .then(function afterLoadCRFs(results) {
      const doc = new PDFDocument();

      doc.pipe(res);

      let marginLeft = 3;
      let marginTop = 20;
      let col = 0;
      let row = 0;
      let perRow = 3;
      let w = 200;
      let h = 115;
      let count = 1;

      req.we.utils.async
      .eachSeries(results, function (r, next) {
        let name;

        if (r.fullName) {
          let fa = r.fullName.split(' ');

          name = fa[0];
          if (fa[1]) {
            if (fa[1].length>2) {
              name += ' \n' + fa[1];
            } else if (fa[2]) {
              name += ' \n' + fa[2];
            }

          }
        } else {
          name = r.displayName.split(' ')[0];
        }

        // displayName
        doc.fontSize(20);
        doc.text(name,
          marginLeft*(col+1) + 10 +(w*col),
          marginTop + 10 +(h*row)
        );
        // registration code
        doc.fontSize(11);
        doc.text('id: '+r.registrationId,
          marginLeft*(col+1) + 10 +(w*col),
          marginTop + 100 +(h*row)
        );

        // draw bounding rectangle
        doc.rect(
          (marginLeft*(col+1) )+(w*col),
          marginTop + 0+(h*row),
          w,
          h
        ).stroke();

        if (col < perRow-1) {
          col++;
        } else {
          col=0;
          row++;
        }

        count++;

        if (count > 18) {
          // next page
          doc.addPage();
          count = 1;
          row = 0;
        }

        next();
      }, function afterCreateThePDF(err) {
        if (err) return res.serverError(err);
        // finalize the PDF and end the stream
        doc.end();
      });
    })
    .catch(res.queryError);
  }
}

function saveUserRegistration(req, res) {
  const we = req.we;
  req.body.userId = req.user.id;
  req.body.eventId = res.locals.event.id;
  let r = res.locals.cfregistrationtypes;

  let choiseRegistrationType;
  for (let j = 0; j < r.length; j++) {
    if (r[j].id == req.body.cfregistrationtypeId) {
      choiseRegistrationType = r[j];
      break;
    }
  }

  // merge req.body with locals record to handle validation errors
  we.utils._.merge(res.locals.data, req.body);

  if (!choiseRegistrationType) {
    we.log.warn('Event: choiseRegistrationType : not found', req.body);
  }

  if (choiseRegistrationType && choiseRegistrationType.requireValidation) {
    req.body.status = 'requested';
  } else {
    req.body.status = 'registered';
  }

  return we.db.models.cfregistration
  .create(req.body)
  .then(function afterCreate(record) {
    let user = req.user.toJSON();

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

      cfregistrationId: record.id,

      cf: res.locals.event,
      cfregistration: record
    };

    we.email.sendEmail('CFRegistrationSuccess', {
      email: req.user.email,
      replyTo: res.locals.event.title + ' <'+res.locals.event.email+'>'
    }, templateVariables, function (err , emailResp){
      if (err) {
        we.log.error('Error on send email CFRegistrationSuccess', err, emailResp);
      }
    });

    res.locals.data = record;
    res.locals.userCfregistration = record;
    res.locals.template =
      'cfregistration/' + res.locals.userCfregistration.status;
    // redirect after register
    res.locals.redirectTo = '/event/' + res.locals.event.id + '/register';


    res.created();
  })
  .catch(res.queryError);
}