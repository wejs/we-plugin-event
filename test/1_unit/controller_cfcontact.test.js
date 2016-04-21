var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var sinon = require('sinon');
var controller, we, salvedConference;

describe('controller_cfcontact', function () {
  before(function (done) {
    controller = require('../../server/controllers/cfcontact.js');
    we = helpers.getWe();

    var cf = stubs.eventStub();
    we.db.models.event.create(cf)
    .then(function (scf) {
      salvedConference = scf;
      done();
    }).catch(done);
  });

  describe('POST', function() {
    it('cfcontact.create should return error if recaptcha.verify return error', function (done) {

      var RCVerify = we.antiSpam.recaptcha.verify;
      var req = {
        method: 'POST', we: we
      };
      var res = {
        locals: {}
      };

      we.antiSpam.recaptcha.verify = function verify(req,  res, cb) {
        cb(new Error());
      };

      controller.create(req, res, function next(err){
        assert(err);

        we.antiSpam.recaptcha.verify = RCVerify;

        done();
      });
    });
    it('cfcontact.create should run res.queryError if recaptcha.verify return isSpam', function (done) {

      var RCVerify = we.antiSpam.recaptcha.verify;
      var warn = we.log.warn;
      we.log.warn = function() {}

      we.antiSpam.recaptcha.verify = function verify(req,  res, cb) {
        cb(null, true);
      };

      var req = {
        method: 'POST', we: we,
        body: {
          email: 'contato@albertosouza.net'
        }
      };
      var res = {
        addMessage: function(status, opts) {
          assert.equal(status, 'warning');
          assert.equal(opts.text, 'auth.register.spam');
          assert.equal(opts.vars.email, req.body.email);
        },
        locals: {},
        queryError: function () {

          we.antiSpam.recaptcha.verify = RCVerify;
          we.log.warn = warn;

          done();
        }
      };

      controller.create(req, res, function(){});
    });

   it('cfcontact.create should create one contact and run sendEmail error logs', function (done) {

      var RCVerify = we.antiSpam.recaptcha.verify;
      var warn = we.log.warn;
      we.log.warn = function() {};

      var error = we.log.error;
      we.log.error = function() {};
      sinon.spy(we.log, 'error');

      var sendEmail = we.email.sendEmail;
      we.email.sendEmail = function(name, opts, tplvars, cb) {
        cb('test.if.call.error');
      }

      we.antiSpam.recaptcha.verify = function verify(req,  res, cb) {
        cb();
      };

      var req = {
        __: we.i18n.__,
        user: { id: 1 },
        isAuthenticated: function() {
          return true;
        },
        method: 'POST', we: we,
        body: {
          name: 'Spiderman',
          email: 'contato@albertosouza.net',
          message: 'Hello world'
        }
      };
      var res = {
        addMessage: function(status, opts) {
          assert.equal(status, 'success');
          assert.equal(opts.text, 'cfcontact.email.success');
        },
        locals: {
          event: salvedConference,
          Model: we.db.models.cfcontact
        },
        queryError: function(err) {
          throw err;
        },
        goTo: function (path) {
          assert.equal(path, '/');

          we.antiSpam.recaptcha.verify = RCVerify;
          we.log.warn = warn;
          we.email.sendEmail = sendEmail;

          assert(we.log.error.called);
          we.log.error = error;

          done();
        }
      };

      controller.create(req, res, function(){});
    });
  });

  describe('GET', function() {
    it('cfcontact.create should run res.ok with req.method="GET"', function (done) {

      var RCVerify = we.antiSpam.recaptcha.verify;
      var req = {
        isAuthenticated: function() {
          return true;
        },
        method: 'GET', we: we,
        user: {
          displayName: 'Alberto', email: 'contato@albertosouza.net'
        }
      };
      var res = {
        locals: { data: {} },
        status: function(s) {
          assert.equal(s, 200);
        },
        ok: function() {
        we.antiSpam.recaptcha.verify = RCVerify;
          done();
        }
      };

      we.antiSpam.recaptcha.verify = function verify(req,  res, cb) {
        cb();
      };

      controller.create(req, res, function (){});
    });
  });
});