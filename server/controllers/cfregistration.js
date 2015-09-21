var PDFDocument = require('pdfkit');

var registrationFields  = [
  'registrationId'+
  'userId'+
  'email'+
  'displayName'+
  'fullName'+
  'status'+
  'registrationDate'
];

module.exports = {
  register: function register(req, res) {
    var we = req.getWe();

    if (!res.locals.record) res.locals.record = {};

    we.db.models.cfregistrationtype.findAll({
      where: { eventId: res.locals.event.id }
    }).then(function (r) {
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

      // return my registration page
      if (req.isAuthenticated() && res.locals.userCfregistration) {
        res.locals.title = req.__('event.registered');

        res.locals.template =
          'cfregistration/' + res.locals.userCfregistration.status;
        // get sessions to user subscribe
        return we.db.models.cfsession.findAll({
          where: {
            eventId: res.locals.event.id,
            requireRegistration: 1
          },
          include: [
            { model: we.db.models.cftopic, as: 'topic' },
            { model: we.db.models.cfroom, as: 'room' },
            { model: we.db.models.cfregistration, as: 'subscribers' }
          ]
        }).then(function (cfsessions) {
          res.locals.userCfregistration.getSessions().then(function(s){
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
        }).catch(res.queryError);
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
          res.locals.record.certificationName = (req.user.fullName || req.user.displayName);
        if (!req.body.userEmail)
          res.locals.record.userEmail = req.user.email;

        res.ok();
      }
    }).catch(res.queryError);
  },

  unRegister: function unRegister(req, res) {
    if (!req.isAuthenticated()) return res.forbidden();
    var we = req.getWe();

    res.locals.deleteMsg = req.__('cfregistration.unRegister.confirm.msg');

    res.locals.deleteRedirectUrl = we.router.urlTo(
      'event.findOne', [res.locals.event.id], we
    );

    if (req.method === 'POST') {
      if (res.locals.userCfregistration) {
        res.locals.userCfregistration.destroy().then(function(){
          res.redirect(we.router.urlTo(
            'event.findOne', [res.locals.event.id], we
          ));
        }).catch(res.queryError);
      } else {
        res.redirect(we.router.urlTo(
          'event.findOne', [res.locals.event.id], we
        ));
      }
    } else {
      res.ok();
    }
  },

  adminRegisterUser: function adminRegisterUser(req, res) {
    console.log('TODO')
    res.ok();
  },
  edit: function editPage(req, res) {
    if (!res.locals.record) return res.notFound();
    var we = req.getWe();

    we.db.models.cfregistrationtype.findAll({
      where: { eventId: res.locals.event.id }
    }).then(function (r) {
      res.locals.cfregistrationtypes = r;

      for (var i = 0; i < r.length; i++) {
        if (r[i].id === res.locals.record.id) {
          r[i].checked = true;
          break;
        }
      }

      if (req.method === 'POST') {
        // dont change event id for registration type
        req.body.eventId = res.locals.event.id;

        res.locals.record.updateAttributes(req.body)
        .then(function() {
          res.updated();
        }).catch(res.queryError);

      } else {
        res.ok();
      }
    }).catch(res.queryError);
  },
  accept: function accept(req, res) {
    res.locals.Model.findOne({
      where: {
        id: req.params.cfregistrationId,
        eventId: res.locals.event.id
      }
    }).then(function (record) {
      if (!record) return res.notFound();

      record.status = 'registered';
      record.save().then(function(){
        res.locals.record = record;
        console.log('send confirmation email', record.status);
        res.ok();
      }).catch(res.queryError);
    }).catch(res.queryError);
  },
  /**
   * Export event registration list
   */
  exportRegistration: function exportRegistration(req, res) {
    var we = req.getWe();

    var order = ' order by fullName ASC ';
    // valid and parse orderby
    if (req.query.order) {
      var orderParams = req.query.order.split(' ');
      if (orderParams.length == 2) {
        if ( (orderParams[1] =='ASC') || (orderParams[1] == 'DESC') ) {
          if (registrationFields.indexOf(orderParams[0])) {
            order = ' order by '+req.query.order;
          }
        }
      }
    }

    var sql = 'SELECT '+
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

    we.db.defaultConnection.query(sql
      , { type: we.db.defaultConnection.QueryTypes.SELECT}
    ).then(function (results) {
        we.csv.stringify(results,{
          header: true,
          quotedString: true,
          columns: {
            registrationId: 'registrationId',
            userId: 'userId',
            email: 'email',
            displayName: 'displayName',
            fullName: 'fullName',
            status: 'status',
            registrationDate: 'registrationDate'
          }
        }, function (err, data){
          if (err) return res.serverError();
          var fileName = 'registration-export-' +
            res.locals.event.id + '-'+
            new Date().getTime() + '.csv';

          res.setHeader('Content-disposition', 'attachment; filename='+fileName);
          res.set('Content-Type', 'application/octet-stream');
          res.send(data);
        });
    }).catch(res.queryError);
  },

  exportRegistrationUserTags: function(req, res) {
    var we = req.getWe();

    var order = ' order by fullName ASC ';
    // valid and parse orderby
    if (req.query.order) {
      var orderParams = req.query.order.split(' ');
      if (orderParams.length == 2) {
        if ( (orderParams[1] =='ASC') || (orderParams[1] == 'DESC') ) {
          if (registrationFields.indexOf(orderParams[0])) {
            order = ' order by '+req.query.order;
          }
        }
      }
    }

    var sql = 'SELECT '+
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

    we.db.defaultConnection.query(sql
      , { type: we.db.defaultConnection.QueryTypes.SELECT}
    ).then(function (results) {

      var doc = new PDFDocument();

      doc.pipe(res);

      var marginLeft = 3;
      var marginTop = 20;
      var col = 0;
      var row = 0;
      var perRow = 3;
      var w = 200;
      var h = 115;
      var count = 1;

      req.we.utils.async.eachSeries(results, function (r, next){
        var name;

        if (r.fullName) {
          var fa = r.fullName.split(' ');

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
      }, function(err){
        if (err) return res.serverError(err);
        // finalize the PDF and end the stream
        doc.end();
      });
    }).catch(res.queryError);
  }
}

function saveUserRegistration(req, res) {
  var we = req.we;
  req.body.userId = req.user.id;
  req.body.eventId = res.locals.event.id;
  var r = res.locals.cfregistrationtypes;

  var choiseRegistrationType;
  for (var j = 0; j < r.length; j++) {
    if (r[j].id == req.body.cfregistrationtypeId) {
      choiseRegistrationType = r[j];
      break;
    }
  }

  // merge req.body with locals record to handle validation errors
  we.utils._.merge(res.locals.record, req.body);

  if (choiseRegistrationType.requireValidation) {
    req.body.status = 'requested';
  } else {
    req.body.status = 'registered';
  }

  return we.db.models.cfregistration.create(req.body)
  .then(function (record) {
    var user = req.user.toJSON();

    var templateVariables = {
      user: user,
      event: res.locals.event,
      cfregistration: record,
      site: {
        name: we.config.appName,
        url: we.config.hostname
      }
    };

    we.email.sendEmail('CFRegistrationSuccess', {
      email: req.user.email,
      subject: req.__('event.registration.success.email') + ' - ' + res.locals.event.abbreviation,
      replyTo: res.locals.event.title + ' <'+res.locals.event.email+'>'
    }, templateVariables, function(err , emailResp){
      if (err) {
        we.log.error('Error on send email CFRegistrationSuccess', err, emailResp);
      }
    });

    res.locals.record = record;
    res.locals.userCfregistration = record;
    res.locals.template =
      'cfregistration/' + res.locals.userCfregistration.status;
    // redirect after register
    res.locals.redirectTo = '/event/' + res.locals.event.id + '/register';
    res.created();
  }).catch(res.queryError);
}