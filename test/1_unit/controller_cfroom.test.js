var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var controller, we;

describe('controller_cfroom', function () {
  before(function (done) {
    controller = require('../../server/controllers/cfroom.js');
    we = helpers.getWe();

    done();
  });

  describe('create', function() {
    it('cfroom.create should run res.ok if not in POST request', function (done) {

      var req = {
        query: {},
        method: 'GET',
        we: we
      };

      var res = {
        locals: {
          event: { id: 12 }
        },
        ok: function() {
          done();
        }
      };

      controller.create(req, res);
    });

    it('cfroom.create should run res.goTo in html response after create the record', function (done) {

      var req = {
        method: 'POST', we: we,
        paramsArray: [ 1 ],
        params: { eventId: 4 },
        body: {
          name: 'Some teaser',
          about: 'Any text'
        },
        isAuthenticated: function() {
          return true;
        },
        user: { id: 1 },
        accepts: function(format) {
          assert.equal(format, 'html');
          return true;
        }
      };
      var res = {
        addMessage: function(status, opts) {
          assert.equal(status, 'success');
          assert.equal(opts.text, 'cfroom.create.success');
          assert(opts.vars.record);
        },
        locals: {
          event: { id: 1 },
          data: null,
          Model:  {
            create: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve({
                  id: 99
                });
              });
            }
          }
        },
        goTo: function(path) {
          assert.equal(path, '/event/1/admin/room');
          done();
        }
      };

      controller.create(req, res, function(){});
    });

    it('cfroom.create should run res.created in json response after create the record', function (done) {

      var req = {
        method: 'POST', we: we,
        params: { eventId: 4 },
        body: {
          name: 'Some teaser',
          about: 'Any text'
        },
        isAuthenticated: function() {
          return true;
        },
        user: { id: 1 },
        accepts: function(format) {
          assert.equal(format, 'html');
          return false;
        }
      };
      var res = {
        addMessage: function(status, opts) {
          assert.equal(status, 'success');
          assert.equal(opts.text, 'cfroom.create.success');
          assert(opts.vars.record);
        },
        locals: {
          event: { id: 1 },
          data: null,
          Model:  {
            create: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve({
                  id: 100
                });
              });
            }
          }
        },
        created: function() {
          assert(res.locals.data.id);
          done();
        }
      };

      controller.create(req, res, function(){});
    });
  });

  describe('edit', function() {
    var RoomFindOne;
    before(function(done) {
      RoomFindOne = we.db.models.cfroom.findOne;
      we.db.models.cfroom.findOne = function() {
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve({
            id: 10
          });
        });
      }
      done();
    });
    after(function(done) {
      we.db.models.cfroom.findOne = RoomFindOne;
      done();
    });

    it('cfroom.edit should run res.notFound without reloaded record', function (done) {

      var req = { we: we };
      var res = {
        locals: { data: null },
        notFound: function() { done(); }
      };

      controller.edit(req, res);
    });

    it('cfroom.edit should run res.ok for GET requests', function (done) {
      var req = { method: 'GET', we: we };
      var res = {
        locals: {
          data: { id: 1 },
        },
        ok: function() {
          done();
        }
      };

      controller.edit(req, res);
    });

    it('cfroom.edit should run res.goTo in html response after update', function (done) {

      var req = {
        method: 'POST', we: we,
        paramsArray: [ 1 ],
        body: {
          name: 'Some teaser',
          about: 'Alberto Souza site'
        },
        user: { id: 1 },
        accepts: function(format) {
          assert.equal(format, 'html');
          return true;
        }
      };
      var res = {
        addMessage: function(status, opts) {
          assert.equal(status, 'success');
          assert.equal(opts.text, 'cfroom.updated.success');
          assert(opts.vars.record);
        },
        locals: {
          event: { id: 1 },
          data: {
            id: 10,
            updateAttributes: function(data) {
              assert(!data.eventId);
              assert(!data.creatorId);
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve();
              });
            },
            toJSON: function(){ return this; }
          }
        },
        goTo: function(path) {
          assert.equal(path, '/event/1/admin/room');
          done();
        }
      };

      controller.edit(req, res);
    });

    it('cfroom.edit should run res.updated in json response after update', function (done) {

      var req = {
        method: 'POST', we: we,
        params: { cfmenuId: 4 },
        body: {
          name: 'Some teaser',
          about: 'Any text'
        },
        user: { id: 1 },
        accepts: function(format) {
          assert.equal(format, 'html');
          return false;
        }
      };
      var res = {
        addMessage: function(status, opts) {
          assert.equal(status, 'success');
          assert.equal(opts.text, 'cfroom.updated.success');
          assert(opts.vars.record);
        },
        locals: {
          event: { id: 1 },
          data: {
            updateAttributes: function(data) {
              assert(!data.eventId);
              assert(!data.creatorId);
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve();
              });
            },
            toJSON: function(){ return this; }
          }
        },
        updated: function() {
          done();
        }
      };

      controller.edit(req, res);
    });
  });

  describe('managePage', function() {
    it('cfroom.managePage should run find controller', function (done) {
      var find = we.controllers.cfroom.find;
      we.controllers.cfroom.find = function () {
        we.controllers.cfroom.find = find;
        done();
      }

      var req = { we: we };
      var res = {};

      controller.managePage(req, res);
    });
  });
});