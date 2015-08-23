var _ = require('lodash');

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
      where: { conferenceId: res.locals.conference.id }
    }).then(function (r) {
      res.locals.cfregistrationtypes = r;

      if (!r || !r.length) {
        res.locals.registrationClosedInfo = req.__('conference.registration.closed');
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

      if (!req.isAuthenticated()) {
        // only authenticated
        res.locals.template = 'cfregistration/registration-unAuthenticated';
        return res.ok();
      } else if (res.locals.userCfregistration) {
        res.locals.title = req.__('conference.registered');

        res.locals.template =
          'cfregistration/' + res.locals.userCfregistration.status;
        // get sessions to user subscribe
        return we.db.models.cfsession.findAll({
          where: {
            conferenceId: res.locals.conference.id,
            requireRegistration: 1
          },
          include: [
            { model: we.db.models.cftopic, as: 'topic' },
            { model: we.db.models.cfroom, as: 'room' },
            { model: we.db.models.cfregistration, as: 'subscribers' }
          ]
        }).then(function (cfsessions) {
          res.locals.sessionsToRegister = cfsessions;

          res.locals.userCfregistration.getSessions().then(function(s){
            res.locals.userCfregistration.sessions = s;
            return res.ok();
          });
        }).catch(res.queryError);
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
      'conference.findOne', [res.locals.conference.id], we
    );

    if (req.method === 'POST') {
      if (res.locals.userCfregistration) {
        res.locals.userCfregistration.destroy().then(function(){
          res.redirect(we.router.urlTo(
            'conference.findOne', [res.locals.conference.id], we
          ));
        }).catch(res.queryError);
      } else {
        res.redirect(we.router.urlTo(
          'conference.findOne', [res.locals.conference.id], we
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
      where: { conferenceId: res.locals.conference.id }
    }).then(function (r) {
      res.locals.cfregistrationtypes = r;

      for (var i = 0; i < r.length; i++) {
        if (r[i].id === res.locals.record.id) {
          r[i].checked = true;
          break;
        }
      }

      if (req.method === 'POST') {
        // dont change conference id for registration type
        req.body.conferenceId = res.locals.conference.id;

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
        conferenceId: res.locals.conference.id
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
   * Export conference registration list
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
    'WHERE cfregistrations.conferenceId='+ res.locals.conference.id+
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
            res.locals.conference.id + '-'+
            new Date().getTime() + '.csv';

          res.setHeader('Content-disposition', 'attachment; filename='+fileName);
          res.set('Content-Type', 'application/octet-stream');
          res.send(data);
        });
    }).catch(res.queryError);
  }
}

function saveUserRegistration(req, res) {
  var we = req.we;
  req.body.userId = req.user.id;
  req.body.conferenceId = res.locals.conference.id;
  var r = res.locals.cfregistrationtypes;

  var choiseRegistrationType;
  for (var j = 0; j < r.length; j++) {
    if (r[j].id == req.body.cfregistrationtypeId) {
      choiseRegistrationType = r[j];
      break;
    }
  }

  // merge req.body with locals record to handle validation errors
  _.merge(res.locals.record, req.body);

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
      conference: res.locals.conference,
      cfregistration: record,
      site: {
        name: we.config.appName,
        url: we.config.hostname
      }
    };

    we.email.sendEmail('CFRegistrationSuccess', {
      email: req.user.email,
      subject: req.__('conference.registration.success.email') + ' - ' + res.locals.conference.abbreviation,
      replyTo: res.locals.conference.title + ' <'+res.locals.conference.email+'>'
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
    res.locals.redirectTo = '/conference/' + res.locals.conference.id + '/register';
    res.created();
  }).catch(res.queryError);
}