var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var controller, we;

describe('controller_cfsession', function () {
  before(function (done) {
    controller = require('../../server/controllers/cfsession.js');
    we = helpers.getWe();

    done();
  });

  describe('create', function() {
    it('cfsession.create should run res.ok if not in POST request', function (done) {

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

    it('cfsession.create should run res.created in json response after create the record', function (done) {

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
          assert.equal(opts.text, 'cfsession.create.success');
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

  describe('find', function() {
    it('cfsession.find should find, count and run res.ok', function (done) {
      var req = {
        __: we.i18n.__,
        we: we,
        params: { userId: 1 }
      };
      var res = {
        locals: {
          event: { id: 10 },
          data: null,
          metadata: {},
          query: {
            order: 'createdAt DESC',
            where: { something: 'the query' }
          },
          Model: {
            findAll: function(opts) {
              assert.equal(opts.where.something, res.locals.query.where.something);

              return new we.db.Sequelize.Promise(function (resolve) {
                resolve([{
                  id: 2,
                  startDate: new Date()
                },{
                  id: 3
                }]);
              });
            },
            count: function(opts) {
              assert.equal(opts, res.locals.query);

              return new we.db.Sequelize.Promise(function (resolve) {
                resolve(2);
              });
            }
          }
        },
        ok: function() {
          done();
        }
      };

      controller.find(req, res);
    });
  });

  describe('markAllAsPresent', function() {
    it('cfsession.markAllAsPresent should run update and goTo with redirectTo', function (done) {

      var update = we.db.models.cfsessionSubscriber.update;
      we.db.models.cfsessionSubscriber.update = function(opts) {
        assert.equal(opts.present, true);
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve([]);
        });
      }

      var req = {
        query: {
        },
        params: {
          cfsessionId: 221
        },
        body: {
          redirectTo: '/go-to-1'
        },
        method: 'POST',
        we: we
      };

      var res = {
        addMessage: function(status, text) {
          assert.equal(status, 'success');
          assert.equal(text, 'cfsession.markAllAsPresent.success');
        },
        locals: {
          event: { id: 12 }
        },
        goTo: function(path) {
          assert.equal(path, '/go-to-1');
          we.db.models.cfsession.update = update;
          done();
        }
      };

      controller.markAllAsPresent(req, res);
    });

    it('cfsession.markAllAsPresent should run update and run res.send', function (done) {

      var update = we.db.models.cfsessionSubscriber.update;
      we.db.models.cfsessionSubscriber.update = function(opts) {
        assert.equal(opts.present, true);
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve([]);
        });
      }

      var req = {
        query: {},
        params: {
          cfsessionId: 22
        },
        body: {},
        method: 'POST',
        we: we
      };

      var res = {
        locals: {
          event: { id: 12 }
        },
        send: function() {
          we.db.models.cfsessionSubscriber.update = update;
          done();
        }
      };

      controller.markAllAsPresent(req, res);
    });
  });
});