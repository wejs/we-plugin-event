var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var controller, we;

describe('controller_cftopic', function () {
  before(function (done) {
    controller = require('../../server/controllers/cftopic.js');
    we = helpers.getWe();

    done();
  });

  describe('create', function() {
    it('cftopic.create should run res.ok if not in POST request', function (done) {

      var req = {
        query: {},
        method: 'GET',
        we: we
      };

      var res = {
        locals: {},
        ok: function() {
          done();
        }
      };

      controller.create(req, res);
    });

    it('cftopic.create should run res.goTo in html response after create the record', function (done) {

      var req = {
        method: 'POST', we: we,
        paramsArray: [ 1 ],
        params: { eventId: 4 },
        body: {
          teaser: 'Some teaser',
          title: 'Alberto Souza site',
          text: 'Any text'
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
          assert.equal(opts.text, 'cftopic.create.success');
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
          assert.equal(path, '/event/1/admin/topic');
          done();
        }
      };

      controller.create(req, res, function(){});
    });

    it('cftopic.create should run res.created in json response after create the record', function (done) {

      var req = {
        method: 'POST', we: we,
        params: { eventId: 4 },
        body: {
          teaser: 'Some teaser',
          title: 'Alberto Souza site',
          text: 'Any text'
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
          assert.equal(opts.text, 'cftopic.create.success');
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

    it('cftopic.edit should run res.notFound without reloaded record', function (done) {

      var req = {};
      var res = {
        locals: { data: null },
        notFound: function() { done(); }
      };

      controller.edit(req, res);
    });

    it('cftopic.edit should run res.ok for GET requests', function (done) {
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

    it('cftopic.edit should run res.goTo in html response after update', function (done) {

      var req = {
        method: 'POST', we: we,
        paramsArray: [ 1 ],
        body: {
          teaser: 'Some teaser',
          title: 'Alberto Souza site',
          text: 'Any text'
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
          assert.equal(opts.text, 'cftopic.updated.success');
          assert(opts.vars.record);
        },
        locals: {
          event: { id: 1 },
          data: {
            id: 10,
            updateAttributes: function(data) {
              assert.equal(data.href, req.body.href);
              assert.equal(data.text, req.body.text);
              assert(!data.cfmenuId);
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
          assert.equal(path, '/event/1/admin/topic');
          done();
        }
      };

      controller.edit(req, res);
    });

    it('cftopic.edit should run res.updated in json response after update', function (done) {

      var req = {
        method: 'POST', we: we,
        params: { cfmenuId: 4 },
        body: {
          teaser: 'Some teaser',
          title: 'Alberto Souza site',
          text: 'Any text'
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
          assert.equal(opts.text, 'cftopic.updated.success');
          assert(opts.vars.record);
        },
        locals: {
          event: { id: 1 },
          data: {
            updateAttributes: function(data) {
              assert.equal(data.href, req.body.href);
              assert.equal(data.text, req.body.text);
              assert(!data.cfmenuId);
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
    it('cftopic.managePage should run find controller', function (done) {
      var find = we.controllers.cftopic.find;
      we.controllers.cftopic.find = function () {
        we.controllers.cftopic.find = find;
        done();
      }

      var req = { we: we };
      var res = {};

      controller.managePage(req, res);
    });
  });

});