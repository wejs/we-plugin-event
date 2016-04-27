var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var controller, we;

describe('controller_event', function () {
  before(function (done) {
    controller = require('../../server/controllers/event.js');
    we = helpers.getWe();

    done();
  });

  describe('location', function(){
    it ('event.location should set res.locals.data and run event.findOne', function(done){

      we.controllers.event.findOne = function(req, res, next) {
        assert(req);
        assert(res);
        assert(next);

        assert.equal(res.locals.data.id, res.locals.event.id);

        done();
      }

      var req = { we: we };
      var res = {
        locals: { event: { id: 12 } },
      };

      controller.location(req, res, function(){});
    });
  });
  describe('find', function() {
    it('event.find should find for new events, count and run res.ok', function (done) {
      var req = {
        query: {},
        isAuthenticated: function() { return false; }
      };
      var res = {
        locals: {
          metadata: {},
          query: { where: {} },
          Model: {
            findAll: function(opts) {
              assert.equal(opts.where.published, true);
              assert(opts.where.eventEndDate.gte);

              return new we.db.Sequelize.Promise(function (resolve) {
                resolve([]);
              });
            },
            count: function(opts) {
              assert.equal(opts.where.published, true);
              assert(opts.where.eventEndDate.gte);

              return new we.db.Sequelize.Promise(function (resolve) {
                resolve(0);
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

    it('event.find should find for new events by tags, count and run res.ok', function (done) {
      var req = {
        we: we,
        query: { tag: 'Saúde' },
        isAuthenticated: function() { return false; }
      };
      var res = {
        locals: {
          metadata: {},
          query: {
            where: {},
            include: []
          },
          Model: {
            findAll: function(opts) {
              assert.equal(opts.where.published, true);
              assert(opts.where.eventEndDate.gte);
              assert(opts.include[0].model);
              assert.equal(opts.include[0].as, 'tagsRecords');
              assert(opts.include[0].required);

              return new we.db.Sequelize.Promise(function (resolve) {
                resolve([]);
              });
            },
            count: function(opts) {
              assert.equal(opts.where.published, true);
              assert(opts.where.eventEndDate.gte);

              return new we.db.Sequelize.Promise(function (resolve) {
                resolve(0);
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

    it('event.find should run forbidden if query.my is set but user is unAuthenticated', function (done) {
      var req = {
        query: { my: true },
        isAuthenticated: function() { return false; }
      };
      var res = {
        locals: {
          metadata: {},
          query: { where: {} }
        },
        forbidden: function() {
          done();
        }
      };

      controller.find(req, res);
    });

    it('event.find with query.my should find for user events, count, loadRegistrationStatus and run res.ok',
    function (done) {
      var cfrFindOne = we.db.models.cfregistration.findOne;
      we.db.models.cfregistration.findOne = function(opts) {
        assert.equal(opts.where.eventId, res.locals.data[0].id);
        assert.equal(opts.where.userId, req.user.id);

        return new we.db.Sequelize.Promise(function (resolve) {
          resolve({
            id: 1
          });
        });
      }

      var req = {
        we: we,
        query: { my: true },
        isAuthenticated: function() { return true; },
        user: { id: 222 }
      };
      var res = {
        locals: {
          metadata: {},
          query: { where: {}, include: [] },
          Model: {
            findAll: function(opts) {
              assert(opts.include[0]);
              assert.equal(opts.include[0].as, 'managers');

              return new we.db.Sequelize.Promise(function (resolve) {
                resolve([{
                  id: 12
                }]);
              });
            },
            count: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve(1);
              });
            }
          }
        },
        ok: function() {
          assert(res.locals.data[0].userCfregistration);
          we.db.models.cfregistration.findOne = cfrFindOne;

          done();
        }
      };

      controller.find(req, res);
    });
  });
  describe('create', function() {
    it('event.create should run res.ok if not in POST request', function (done) {

      var req = {
        query: {},
        method: 'GET',
        we: we
      };

      var res = {
        locals: {},
        ok: function() {
          assert(res.locals.data);
          done();
        }
      };

      controller.create(req, res);
    });

    it('event.create should set res.locals.redirectTo in html response after create the record', function (done) {

      var req = {
        method: 'POST', we: we,
        body: {
          name: 'Some teaser'
        },
        isAuthenticated: function() {
          return true;
        },
        user: { id: 1 }
      };
      var res = {
        addMessage: function(status, opts) {
          assert.equal(status, 'success');
          assert.equal(opts.text, 'event.create.success');
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
        created: function() {
          assert.equal(res.locals.redirectTo, '/event/99/edit');
          done();
        }
      };

      controller.create(req, res, function(){});
    });
  });
  describe('edit', function() {

    it('event.edit should run res.notFound without preloaded record', function (done) {

      var req = {};
      var res = {
        locals: { data: null },
        notFound: function() { done(); }
      };

      controller.edit(req, res);
    });

    it('event.edit should run res.ok for GET requests', function (done) {
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

    it('event.edit should set res.redirectTo after update', function (done) {

      var req = {
        method: 'POST', we: we,
        paramsArray: [ 1 ],
        body: {
          name: 'Some teaser'
        },
        user: { id: 1 }
      };
      var res = {
        addMessage: function(status, opts) {
          assert.equal(status, 'success');
          assert.equal(opts.text, 'event.updated.success');
          assert(opts.vars.record);
        },
        locals: {
          event: { id: 1 },
          data: {
            id: 10,
            updateAttributes: function(data) {
              assert.equal(data.name, req.body.name);

              return new we.db.Sequelize.Promise(function (resolve) {
                resolve();
              });
            }
          }
        },
        updated: function() {
          assert(!res.locals.redirectTo);
          done();
        }
      };

      controller.edit(req, res);
    });

    it('event.edit should run res.updated after set redirect url if user click in save_next', function (done) {

      var req = {
        path: '/event/1/edit',
        method: 'POST', we: we,
        query: {},
        body: {
          name: 'Some teaser',
          save_next: true
        },
        user: { id: 1 }
      };
      var res = {
        addMessage: function(status, opts) {
          assert.equal(status, 'success');
          assert.equal(opts.text, 'event.updated.success');
          assert(opts.vars.record);
        },
        locals: {
          event: { id: 1 },
          data: {
            updateAttributes: function(data) {
              assert.equal(data.name, req.body.name);
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve();
              });
            },
            toJSON: function(){ return this; }
          }
        },
        updated: function() {
          assert.equal(res.locals.redirectTo, req.path+'?step=2');
          done();
        }
      };

      controller.edit(req, res);
    });

    it('event.edit should run res.updated after set redirect url if user click in save_next to next step', function (done) {

      var req = {
        path: '/event/1/edit',
        method: 'POST', we: we,
        query: { step: 2 },
        body: {
          name: 'Some teaser',
          save_next: true
        },
        user: { id: 1 }
      };
      var res = {
        addMessage: function(status, opts) {
          assert.equal(status, 'success');
          assert.equal(opts.text, 'event.updated.success');
          assert(opts.vars.record);
        },
        locals: {
          event: { id: 1 },
          data: {
            updateAttributes: function(data) {
              assert.equal(data.name, req.body.name);
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve();
              });
            },
            toJSON: function(){ return this; }
          }
        },
        updated: function() {
          assert.equal(res.locals.redirectTo, req.path+'?step=3');
          done();
        }
      };

      controller.edit(req, res);
    });
  });
  describe('adminIndex', function() {
    it('event.adminIndex should load cfsessions how requireRegistration and run res.ok', function (done){
      var sFindAll = we.db.models.cfsession.findAll;
      we.db.models.cfsession.findAll = function() {
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve([{
            id: 30
          }]);
        });
      }

      var req = { we: we, __: we.i18n.__ };
      var res = {
        locals: {
          event: { id: 12 }
        },
        ok: function() {
          assert(res.locals.sessionsToRegister);

          we.db.models.cfsession.findAll = sFindAll;

          done();
        }
      };

      controller.adminIndex(req, res);
    });

    it('event.adminIndex should run res.ok if cfssesion find returns error', function (done){
      var sFindAll = we.db.models.cfsession.findAll;
      we.db.models.cfsession.findAll = function() {
        return new we.db.Sequelize.Promise(function (resolve, reject) {
          reject('test.error');
        });
      }

      var req = { we: we, __: we.i18n.__ };
      var res = {
        locals: {
          event: { id: 12 }
        },
        queryError: function(err) {
          assert(err, 'test.error');

          we.db.models.cfsession.findAll = sFindAll;

          done();
        }
      };

      controller.adminIndex(req, res);
    });

  });

  describe('adminMenu', function() {
    it('event.adminMenu should set title and run res.ok', function(done){

      var req = { __: we.i18n.__ };
      var res = {
        locals: {},
        ok: function() {
          assert(res.locals.title);
          assert.equal(res.locals.title, we.i18n.__('Menus') );
          done(); }
      };

      controller.adminMenu(req, res);
    });
  });
});