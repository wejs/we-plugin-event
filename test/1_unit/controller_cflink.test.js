var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var sinon = require('sinon');
var controller, we, salvedConference;

describe('controller_cflink', function () {
  before(function (done) {
    controller = require('../../server/controllers/cflink.js');
    we = helpers.getWe();

    var cf = stubs.eventStub();
    we.db.models.event.create(cf)
    .then(function (scf) {
      salvedConference = scf;
      done();
    }).catch(done);
  });

  describe('create', function() {
    it('cflink.create should run res.ok if not in POST request', function (done) {

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

    it('cflink.create should run res.goTo in html response after create the record', function (done) {

      var req = {
        method: 'POST', we: we,
        params: { cfmenuId: 4 },
        body: {
          href: 'http://albertosouza.net',
          text: 'Site',
          title: 'Alberto Souza site',
          class: 'link-alberto-site',
          target: '_blank'
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
          assert.equal(opts.text, 'cflink.create.success');
          assert(opts.vars.record);
        },
        locals: {
          event: { id: 1 },
          data: null
        },
        goTo: function(path) {
          assert.equal(path, '/event/1/admin/cfmenu/4/edit');
          done();
        }
      };

      controller.create(req, res, function(){});
    });

    it('cflink.create should run res.created in json response after create the record', function (done) {

      var req = {
        method: 'POST', we: we,
        params: { cfmenuId: 4 },
        body: {
          href: 'http://albertosouza.net',
          text: 'Site',
          title: 'Alberto Souza site',
          class: 'link-alberto-site',
          target: '_blank'
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
          assert.equal(opts.text, 'cflink.create.success');
          assert(opts.vars.record);
        },
        locals: {
          event: { id: 1 },
          data: null
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

    it('cflink.edit should run res.notFound without reloaded record', function (done) {

      var req = {};
      var res = {
        locals: { data: null },
        notFound: function() { done(); }
      };

      controller.edit(req, res);
    });

    it('cflink.edit should run res.ok for GET requests', function (done) {
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

    it('cflink.edit should run res.goTo in html response after update', function (done) {

      var req = {
        method: 'POST', we: we,
        params: { cfmenuId: 4 },
        body: {
          href: 'https://albertosouza.net',
          text: 'Site!!!',
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
          assert.equal(opts.text, 'cflink.updated.success');
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
        goTo: function(path) {
          assert.equal(path, '/event/1/admin/cfmenu/4/edit');
          done();
        }
      };

      controller.edit(req, res);
    });

    it('cflink.edit should run res.updated in json response after update', function (done) {

      var req = {
        method: 'POST', we: we,
        params: { cfmenuId: 4 },
        body: {
          href: 'https://albertosouza.net',
          text: 'Site!!!',
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
          assert.equal(opts.text, 'cflink.updated.success');
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

  describe('sortLinks', function() {
    it('cflink.sortLinks should run res.goTo without req.body and with redirectTo', function (done) {

      var req = {
        query: {
          redirectTo: '/xyz'
        },
        we: we,
        body: null
      };
      var res = {
        locals: { data: null },
        goTo: function(path) {
          assert.equal(path, '/xyz');
          done();
        }
      };

      controller.sortLinks(req, res);
    });

    it('cflink.sortLinks should run res.send without req.body and redirectTo', function (done) {

      var req = {
        query: null,
        we: we,
        body: null
      };
      var res = {
        send: function() {
          done();
        }
      };

      controller.sortLinks(req, res);
    });

    it('cflink.sortLinks should run res.notFound if not found the cfmenu', function (done) {

      var findOne = we.db.models.cfmenu.findOne;
      we.db.models.cfmenu.findOne = function(opts) {
        assert.equal(opts.include.all, true);
        assert.equal(opts.where.id, req.params.cfmenuId);

        return new we.db.Sequelize.Promise(function (resolve) {
          resolve(null);
        });
      }

      var req = {
        query: null,
        params: { cfmenuId: 4 },
        we: we,
        body: {
          'link-1-id': 1,
          'link-1-weight': 10,
          'link-1-depth': 2
        }
      };
      var res = {
        notFound: function() {
          we.db.models.cfmenu.findOne = findOne;
          done();
        }
      };

      controller.sortLinks(req, res);
    });

    it('cflink.sortLinks should run res.serverError link update returns error', function (done) {

      var findOne = we.db.models.cfmenu.findOne;
      we.db.models.cfmenu.findOne = function(opts) {
        assert.equal(opts.include.all, true);
        assert.equal(opts.where.id, req.params.cfmenuId);

        return new we.db.Sequelize.Promise(function (resolve) {
          resolve({
            id: opts.where.id,
            links: [{
              id: 1,
              updateAttributes: function(opts) {
                assert.equal(opts.id, 1);
                assert.equal(opts.weight, 10);
                assert.equal(opts.depth, 2);

                return new we.db.Sequelize.Promise(function (resolve, reject) {
                  reject('test.fake.error');
                });
              }
            }]
          });
        });
      }

      var req = {
        query: null,
        params: { cfmenuId: 4 },
        we: we,
        body: {
          'link-1-id': 1,
          'link-1-weight': 10,
          'link-1-depth': 2
        }
      };
      var res = {
        serverError: function(err) {
          assert.equal(err, 'test.fake.error');
          we.db.models.cfmenu.findOne = findOne;
          done();
        }
      };

      controller.sortLinks(req, res);
    });

    it('cflink.sortLinks should run res.goTo after update with redirectTo params', function (done) {

      var findOne = we.db.models.cfmenu.findOne;
      we.db.models.cfmenu.findOne = function(opts) {
        assert.equal(opts.include.all, true);
        assert.equal(opts.where.id, req.params.cfmenuId);

        return new we.db.Sequelize.Promise(function (resolve) {
          resolve({
            id: opts.where.id,
            links: [{
              id: 1,
              updateAttributes: function(opts) {
                assert.equal(opts.id, 1);
                assert.equal(opts.weight, 10);
                assert.equal(opts.depth, 2);

                return new we.db.Sequelize.Promise(function (resolve) {
                  resolve();
                });
              }
            }]
          });
        });
      }

      var req = {
        query: {
          redirectTo: '/'
        },
        params: { cfmenuId: 4 },
        we: we,
        body: {
          'link-1-id': 1,
          'link-1-weight': 10,
          'link-1-depth': 2
        }
      };
      var res = {
        goTo: function(path) {
          assert.equal(path, '/');
          we.db.models.cfmenu.findOne = findOne;
          done();
        }
      };

      controller.sortLinks(req, res);
    });

    it('cflink.sortLinks should run res.send after update', function (done) {

      var findOne = we.db.models.cfmenu.findOne;
      we.db.models.cfmenu.findOne = function(opts) {
        assert.equal(opts.include.all, true);
        assert.equal(opts.where.id, req.params.cfmenuId);

        return new we.db.Sequelize.Promise(function (resolve) {
          resolve({
            id: opts.where.id,
            links: [{
              id: 1,
              updateAttributes: function(opts) {
                assert.equal(opts.id, 1);
                assert.equal(opts.weight, 10);
                assert.equal(opts.depth, 2);

                return new we.db.Sequelize.Promise(function (resolve) {
                  resolve();
                });
              }
            }, {
              id: 2 // will skil this link
            }]
          });
        });
      }

      var req = {
        query: null,
        params: { cfmenuId: 4 },
        we: we,
        body: {
          'link-1-id': 1,
          'link-1-weight': 10,
          'link-1-depth': 2
        }
      };
      var res = {
        send: function(data) {
          assert(data.cfmenu);
          assert.equal(data.cfmenu.links[0].id, 1);

          done();
        }
      };

      controller.sortLinks(req, res);
    });
  });

  describe('findOne', function() {
    it('cflink.findOne should run next if not find the preloaded record', function (done) {
      var req = {};
      var res = { locals: { data: null } };

      controller.findOne(req, res, function (){
        done();
      });
    });
    it('cflink.findOne should run res.goTo for html request', function (done) {

      var req = {
        params: {
          cfmenuId: 1
        },
        accepts: function(format) {
          assert.equal(format, 'html');
          return true;
        },
        method: 'GET', we: we
      };
      var res = {
        locals: {
          event: {
            id: 3
          },
          data: { id: 1 } },
        goTo: function(path) {
          assert.equal(path, '/event/3'+
            '/admin/cfmenu/1/edit');
          done();
        }
      };

      controller.findOne(req, res, function (){});
    });

    it('cflink.findOne should run res.ok for json request', function (done) {

      var req = {
        params: {
          cfmenuId: 1
        },
        accepts: function(format) {
          assert.equal(format, 'html');
          return false; // is json
        },
        method: 'GET', we: we
      };
      var res = {
        locals: {
          event: { id: 3 },
          data: { id: 1 }
        },
        ok: function() {
          done();
        }
      };

      controller.findOne(req, res, function (){});
    });
  });
});