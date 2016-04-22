var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var controller, we;

describe('controller_cfregistrationtype', function () {
  before(function (done) {
    controller = require('../../server/controllers/cfregistrationtype.js');
    we = helpers.getWe();

    done();
  });

  describe('markAllAsPresent', function() {
    it('cfregistrationtype.markAllAsPresent should run update and goTo with redirectTo', function (done) {

      var update = we.db.models.cfregistration.update;
      we.db.models.cfregistration.update = function(opts) {
        assert.equal(opts.present, true);
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve([]);
        });
      }

      var req = {
        query: {},
        body: {
          redirectTo: '/go-to-1'
        },
        method: 'POST',
        we: we
      };

      var res = {
        addMessage: function(status, text) {
          assert.equal(status, 'success');
          assert.equal(text, 'cfregistrationtype.markAllAsPresent.success');
        },
        locals: {
          event: { id: 12 }
        },
        goTo: function(path) {
          assert.equal(path, '/go-to-1');
          we.db.models.cfregistration.update = update;
          done();
        }
      };

      controller.markAllAsPresent(req, res);
    });

    it('cfregistrationtype.markAllAsPresent should run update and run res.send', function (done) {

      var update = we.db.models.cfregistration.update;
      we.db.models.cfregistration.update = function(opts) {
        assert.equal(opts.present, true);
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve([]);
        });
      }

      var req = {
        query: {},
        body: {},
        method: 'POST',
        we: we
      };

      var res = {
        locals: {
          event: { id: 12 }
        },
        send: function() {
          we.db.models.cfregistration.update = update;
          done();
        }
      };

      controller.markAllAsPresent(req, res);
    });
  });

  describe('delete', function() {
    it('cfregistrationtype.delete should run res.ok with get request', function (done) {

      var req = { method: 'GET', we: we };

      var res = {
        locals: {
          data: { id: 1 }
        },
        ok: function() {
          assert.equal(res.locals.deleteMsg, 'cfregistrationtype.delete.confirm.msg');
          done();
        }
      };

      controller.delete(req, res);
    });

    it('cfregistrationtype.delete should run res.notFound if record not is preloaded', function (done) {

      var req = { method: 'GET', we: we };

      var res = {
        locals: {
          data: null
        },
        notFound: function() {
          done();
        }
      };

      controller.delete(req, res);
    });
  });

});