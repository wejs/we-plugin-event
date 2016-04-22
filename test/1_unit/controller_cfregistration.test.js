var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var controller, we, RTfindAll, RfindOne;

describe('controller_cfregistration', function () {
  before(function (done) {
    controller = require('../../server/controllers/cfregistration.js');
    we = helpers.getWe();

    RTfindAll = we.db.models.cfregistrationtype.findAll;
    we.db.models.cfregistrationtype.findAll = function(){
      return new we.db.Sequelize.Promise(function (resolve) {
        resolve([{
          id: 11
        }]);
      });
    };

    RfindOne = we.db.models.cfregistration.findOne;

    done();
  });
  after(function (done) {
    we.db.models.cfregistrationtype.findAll = RTfindAll;
    we.db.models.cfregistration.findOne = RfindOne
    done();
  });

  describe('create', function() {
    it('cfregistration.create should run res.ok if not is POST request', function (done) {

      var req = {
        query: {},
        method: 'GET',
        we: we
      };

      var res = {
        locals: { event: { id: 12 } },
        ok: function() {
          done();
        }
      };

      controller.create(req, res);
    });

    it('cfregistration.create should run res.ok if user already is registered', function (done) {

      we.db.models.cfregistration.findOne = function(opts){
        assert.equal(opts.where.userId, req.body.userId);

        return new we.db.Sequelize.Promise(function (resolve) {
          resolve({
            id: 20, userId: req.body.userId
          });
        });
      };

      var req = {
        method: 'POST', we: we,
        params: { eventId: 4 },
        body: { userId: 1 },
        isAuthenticated: function() {
          return true;
        }
      };
      var res = {
        addMessage: function(status, opts) {
          assert.equal(status, 'warn');
          assert.equal(opts.text, 'cfregistration.create.user.registered');
        },
        locals: {
          event: { id: 1 },
          data: null
        },
        ok: function() {
          done();
        }
      };

      controller.create(req, res, function(){});
    });

    it('cfregistration.create should run res.created after create the record', function (done) {

      we.db.models.cfregistration.findOne = function(){
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve();
        });
      };

      var req = {
        method: 'POST', we: we,
        params: { eventId: 4 },
        body: { userId: 1 },
        isAuthenticated: function() {
          return true;
        },
        user: { id: 1 }
      };
      var res = {
        addMessage: function(status, opts) {
          assert.equal(status, 'success');
          assert.equal(opts.text, 'cfregistration.create.success');
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

  describe('register', function() {
    it('cfregistration.register should run res.ok if event dont have registrationTypes and set message',
    function (done) {
      var findAll = we.db.models.cfregistrationtype.findAll;

      we.db.models.cfregistrationtype.findAll = function(){
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve();
        });
      };

      var req = {
        __: we.i18n.__,
        query: {},
        method: 'GET',
        we: we
      };

      var res = {
        locals: { event: { id: 12 } },
        ok: function() {
          we.db.models.cfregistrationtype.findAll = findAll;

          assert.equal(res.locals.registrationClosedInfo, 'event.registration.closed');
          assert.equal(res.locals.template, 'cfregistration/registration-closed');

          done();
        }
      };

      controller.register(req, res);
    });

    it('cfregistration.register should run we.controllers.cfregistration.myRegistrationPage if user are registered',
    function (done) {
      var myRegistrationPage = we.controllers.cfregistration.myRegistrationPage;
      we.controllers.cfregistration.myRegistrationPage = function() {
        we.controllers.cfregistration.myRegistrationPage =myRegistrationPage;

        done();
      }

      var req = {
        __: we.i18n.__,
        query: {},
        method: 'GET',
        we: we,
        isAuthenticated: function() {
          return true;
        }
      };

      var res = {
        locals: {
          event: { id: 12 },
          userCfregistration: { id: 1 }
        }
      };

      controller.register(req, res);
    });

    it('cfregistration.register should run res.goTo if event registration not is open',
    function (done) {
      var req = {
        __: we.i18n.__,
        query: {},
        method: 'GET',
        we: we,
        isAuthenticated: function() {
          return false;
        }
      };

      var res = {
        locals: {
          event: { id: 12, registrationStatus: 'closed' },
          userCfregistration: false
        },
        addMessage: function(status, text) {
          assert.equal(status, 'error');
          assert.equal(text, 'event.closed');
        },
        goTo: function(path) {
          assert.equal(path, '/event/12');
          done();
        }
      };

      controller.register(req, res);
    });

    it('cfregistration.register should run res.ok and set unAuthenticated template if is open and unAuthenticated',
    function (done) {
      var req = {
        __: we.i18n.__,
        query: {},
        we: we,
        isAuthenticated: function() {
          return false;
        }
      };

      var res = {
        locals: {
          event: { id: 12, registrationStatus: 'open' },
          userCfregistration: false
        },
        ok: function() {
          assert.equal(res.locals.template, 'cfregistration/registration-unAuthenticated');
          done();
        }
      };

      controller.register(req, res);
    });

    it('cfregistration.register should run res.ok and set unAuthenticated template if is open and authenticated',
    function (done) {
      var req = {
        __: we.i18n.__,
        query: {},
        method: 'GET',
        we: we,
        isAuthenticated: function() {
          return true;
        },
        user: {
          id: 39,
          fullName: 'Super Man',
          displayName: 'Clark',
          email: 'contato@albertosouza.net'
        }
      };

      var res = {
        locals: {
          data: {},
          event: { id: 12, registrationStatus: 'open' },
          userCfregistration: false
        },
        ok: function() {
          assert.equal(res.locals.data.certificationName, req.user.fullName);
          assert.equal(res.locals.data.userEmail, req.user.email);

          assert(!res.locals.template);
          done();
        }
      };

      controller.register(req, res);
    });

    it('cfregistration.register should run res.created for post request and valid data',
    function (done) {

      var create = we.db.models.cfregistration.create;
      we.db.models.cfregistration.create = function() {
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve({
            id: 6,
            status: 'registered'
          });
        });
      }

      var sendEmail = we.email.sendEmail;
      we.email.sendEmail = function(name) {
        assert.equal(name, 'CFRegistrationSuccess');
      }

      var req = {
        __: we.i18n.__,
        query: {},
        body: { cfregistrationtypeId: 11 },
        method: 'POST',
        we: we,
        isAuthenticated: function() {
          return true;
        },
        user: {
          id: 39,
          fullName: 'Super Man',
          displayName: 'Clark',
          email: 'contato@albertosouza.net',
          toJSON: function() { return this }
        }
      };

      var res = {
        locals: {
          __: we.i18n.__,
          data: {},
          event: { id: 12, registrationStatus: 'open' },
          userCfregistration: false
        },
        created: function() {
          assert(res.locals.userCfregistration);
          assert.equal(res.locals.redirectTo, '/event/12/register');

          we.db.models.cfregistration.create = create;
          we.email.sendEmail = sendEmail;

          done();
        }
      };

      controller.register(req, res);
    });
  });

  describe('unRegister', function() {
    it('cfregistration.unRegister should run res.forbidden if user not is authenticated',
    function (done) {
      var req = {
        we: we,
        isAuthenticated: function() {
          return false;
        }
      };

      var res = {
        forbidden: function() {
          done();
        }
      };

      controller.unRegister(req, res);
    });

    it('cfregistration.unRegister should run res.ok if req.method=GET',
    function (done) {
      var req = {
        __: we.i18n.__,
        we: we,
        method: 'GET',
        isAuthenticated: function() { return true; }
      };

      var res = {
        locals: { event: { id: 12 } },
        ok: function() {
          assert(res.locals.deleteMsg);
          assert(res.locals.deleteRedirectUrl);
          done();
        }
      };

      controller.unRegister(req, res);
    });

    it('cfregistration.unRegister should delete user registration and goTo',
    function (done) {
      var req = {
        __: we.i18n.__,
        we: we,
        method: 'DELETE',
        isAuthenticated: function() { return true; }
      };

      var res = {
        locals: {
          userCfregistration: {
            destroy: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve();
              });
            }
          },
          event: { id: 12 }
        },
        goTo: function(path) {
          assert(res.locals.deleteMsg);
          assert(res.locals.deleteRedirectUrl);

          assert.equal(path, '/event/12');

          done();
        }
      };

      controller.unRegister(req, res);
    });


    it('cfregistration.unRegister should only run and goTo without userCfregistration',
    function (done) {
      var req = {
        __: we.i18n.__,
        we: we,
        method: 'DELETE',
        isAuthenticated: function() { return true; }
      };

      var res = {
        locals: {
          userCfregistration: null,
          event: { id: 12 }
        },
        goTo: function(path) {
          assert(res.locals.deleteMsg);
          assert(res.locals.deleteRedirectUrl);

          assert.equal(path, '/event/12');

          done();
        }
      };

      controller.unRegister(req, res);
    });

  });

  describe('myRegistrationPage', function(){
    it('cfregistration.myRegistrationPage should run res.ok after load all user cfsessions',
    function (done) {
      var findAll = we.db.models.cfsession.findAll;
      we.db.models.cfsession.findAll = function() {
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve([{
            id: 6,
            haveTimeConflict: function() {
              return false;
            }
          }, {
            id: 5,
            haveTimeConflict: function() {
              return true;
            }
          }]);
        });
      }
      var req = {
        __: we.i18n.__,
        query: {},
        we: we,
        isAuthenticated: function() {
          return true;
        }
      };

      var res = {
        locals: {
          event: { id: 12 },
          userCfregistration: {
            id: 1 ,
            status: 'registered',
            getSessions: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve([{
                  id: 6
                },{
                  id: 7
                }]);
              });
            }
          }
        },
        ok: function() {
          assert.equal(res.locals.title, 'event.registered');

          we.db.models.cfsession.findAll = findAll;
          done();
        }
      };

      controller.myRegistrationPage(req, res);
    });
  });

  describe('edit', function() {
    it('cfregistration.register should run res.notFound if not have the preloaded record', function(done) {
      var req = {};
      var res = {
        locals: { data: null },
        notFound: function() {
          done();
        }
      };

      controller.edit(req, res);
    });

    it('cfregistration.register should run res.ok if req.method=GET', function(done) {
      var req = {
        method: 'GET', we: we
      };
      var res = {
        locals: {
          event: {
            id: 10
          },
          data: {
            id: 222
          }
        },
        ok: function() {
          done();
        }
      };

      controller.edit(req, res);
    });

    it('cfregistration.register should update the record and run res.updated', function(done) {
      var req = {
        method: 'PUT', we: we,
        body: {
          eventId: 13123121,
          status: 'registered'
        }
      };
      var res = {
        locals: {
          event: {
            id: 10
          },
          data: {
            id: 222,
            updateAttributes: function(data) {
              assert.equal(data.status, 'registered');
              assert.equal(data.eventId, null);

              return new we.db.Sequelize.Promise(function (resolve) {
                resolve();
              });
            }
          }
        },
        updated: function() {
          done();
        }
      };

      controller.edit(req, res);
    });
  });

  describe('accept', function() {
    it('cfregistration.accept should run res.notFound if not not find the record', function(done) {
      var req = {
        params: {
          cfregistrationId: 111
        }
      };
      var res = {
        locals: {
          event: { id: 12 },
          Model: {
            findOne: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve();
              });
            }
          }
        },
        notFound: function() {
          done();
        }
      };

      controller.accept(req, res);
    });

    it('cfregistration.accept should update the record status and run res.ok', function(done) {
      var req = {
        we:we,
        params: {
          cfregistrationId: 111
        }
      };
      var res = {
        locals: {
          event: { id: 12 },
          Model: {
            findOne: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve({
                  id: 1,
                  save: function() {
                    return new we.db.Sequelize.Promise(function (resolve) {
                      resolve();
                    });
                  }
                });
              });
            }
          }
        },
        ok: function() {
          done();
        }
      };

      controller.accept(req, res);
    });
  });

  describe('exportRegistration', function() {
    it('cfregistration.exportRegistration should run res.serverError if not have the we-plugin-csv', function(done) {
      var req = {
        we: we
      };
      var res = {
        serverError: function() {
          done();
        }
      };

      controller.exportRegistration(req, res);
    });

    it('cfregistration.exportRegistration should run res.ok after load cfregistrations data', function(done) {

      we.plugins['we-plugin-csv'] = true;

      var query = we.db.defaultConnection.query;
      we.db.defaultConnection.query = function() {
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve([{
            id: 1
          }]);
        });
      }

      var req = {
        query: {
          order: 'registrationDate DESC'
        },
        we: we
      };
      var res = {
        locals: {
          event: { id: 12 }
        },
        ok: function() {
          we.db.defaultConnection.query = query;
          done();
        }
      };

      controller.exportRegistration(req, res);
    });
  });

  describe('exportRegistrationUserTags', function() {
    it('cfregistration.exportRegistrationUserTags should loadData, generate pdf and pipe to res');
  });
});