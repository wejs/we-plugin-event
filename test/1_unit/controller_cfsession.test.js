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

  describe('addRegistration', function() {
    it('cfsession.addRegistration should run res.forbidden if user not is isAuthenticated', function (done) {

      var req = {
        isAuthenticated: function() {
          return false;
        }
      };
      var res = {
        forbidden: function() {
          done();
        }
      };

      controller.addRegistration(req, res);
    });

    it('cfsession.addRegistration should set message and run res.gotTo if not have cfsessionId in body', function (done) {
      var req = {
        body: {},
        params: {},
        isAuthenticated: function() {
          return true;
        }
      };

      var res = {
        locals: { redirectTo: '/somepath' },
        addMessage: function(status, text) {
          assert.equal(status, 'warning');
          assert.equal(text, 'cfsession.registration.cfsessionIsRequired');
        },
        goTo: function(path) {
          assert.equal(path, res.locals.redirectTo);
          done();
        }
      };

      controller.addRegistration(req, res);
    });

    it('cfsession.addRegistration should set message and run res.gotTo if user not is in event', function (done) {
      var req = {
        body: {
          cfsessionId: 10
        },
        isAuthenticated: function() {
          return true;
        }
      };

      var res = {
        locals: { userCfregistration: {}, redirectTo: '/somepath' },
        addMessage: function(status, text) {
          assert.equal(status, 'error');
          assert.equal(text, 'cfsession.addRegistration.user.not.in.event');
        },
        goTo: function(path) {
          assert.equal(path, res.locals.redirectTo);
          done();
        }
      };

      controller.addRegistration(req, res);
    });

    it('cfsession.addRegistration should run res.notFound if not find the session', function (done) {

      var cfsFindOne = we.db.models.cfsession.findOne;
      we.db.models.cfsession.findOne = function() {
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve();
        });
      }

      var req = {
        we: we,
        body: { cfsessionId: 10 },
        isAuthenticated: function() {
          return true;
        }
      };

      var res = {
        locals: {
          userCfregistration: {
            id: 20,
            status: 'registered'
          }
        },
        notFound: function() {
          we.db.models.cfsession.findOne = cfsFindOne;
          done();
        }
      };

      controller.addRegistration(req, res);
    });

    it('cfsession.addRegistration should run res.goTo if find the session but dont have vacancy', function (done) {

      var cfsFindOne = we.db.models.cfsession.findOne;
      we.db.models.cfsession.findOne = function() {
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve({
            id: 30, haveVacancy: false
          });
        });
      }

      var req = {
        we: we,
        body: { cfsessionId: 10 },
        isAuthenticated: function() {
          return true;
        }
      };

      var res = {
        locals: {
          userCfregistration: {
            id: 20,
            status: 'registered'
          }
        },
        addMessage: function(status, text) {
          assert.equal(status, 'warning');
          assert.equal(text, 'cfsession.not.haveVacancy');
        },

        goTo: function(path) {
          assert.equal(path, '/');
          we.db.models.cfsession.findOne = cfsFindOne;
          done();
        }
      };

      controller.addRegistration(req, res);
    });

    it('cfsession.addRegistration should run res.goTo if already did the subscribe but dont have vacancy',
      function (done) {

      var cfsFindOne = we.db.models.cfsession.findOne;
      we.db.models.cfsession.findOne = function() {
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve({
            id: 30,
            haveVacancy: true,
            vacancy: 10,
            addSubscribers: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve({});
              });
            },
            getSubscriberCount: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve(12);
              });
            },
            removeSubscribers: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve();
              });
            }
          });
        });
      }

      var req = {
        we: we,
        body: { cfsessionId: 10 },
        isAuthenticated: function() {
          return true;
        },
        user: {
          id: 1,
          toJSON: function() {
            return this;
          }
        }
      };

      var res = {
        locals: {
          userCfregistration: {
            id: 20,
            status: 'registered'
          },
          event: { id: 1 }
        },
        addMessage: function(status, text) {
          assert.equal(status, 'warning');
          assert.equal(text, 'cfsession.not.haveVacancy');
        },

        goTo: function(path) {
          assert.equal(path, '/');
          we.db.models.cfsession.findOne = cfsFindOne;
          done();
        }
      };

      controller.addRegistration(req, res);
    });

    it('cfsession.addRegistration should run res.goTo and send email', function (done) {
      var sendEmail = we.email.sendEmail;
      we.email.sendEmail = function(name, opts, tpsv, cb) {
        assert.equal(name, 'CFSessionRegisterSuccess');
        cb('err');
      }

      var error = we.log.error;
      we.log.error = function() {};

      var cfsFindOne = we.db.models.cfsession.findOne;
      we.db.models.cfsession.findOne = function() {
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve({
            id: 30,
            haveVacancy: true,
            vacancy: 10,
            addSubscribers: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve({});
              });
            },
            getSubscriberCount: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve(10);
              });
            }
          });
        });
      }

      var req = {
        __: we.i18n.__,
        we: we,
        body: { cfsessionId: 10 },
        isAuthenticated: function() {
          return true;
        },
        user: {
          id: 1,
          toJSON: function() {
            return this;
          }
        }
      };

      var res = {
        locals: {
          event: { id: 12, abbreviation: 'test1' },
          userCfregistration: {
            id: 20,
            status: 'registered'
          }
        },
        addMessage: function(status, text) {
          assert.equal(status, 'success');
          assert.equal(text, 'cfsession.addRegistration.success');
        },

        goTo: function(path) {
          assert.equal(path, '/event/12/register');
          we.email.sendEmail = sendEmail;
          we.log.error = error;
          we.db.models.cfsession.findOne = cfsFindOne;
          done();
        }
      };

      controller.addRegistration(req, res);
    });
  });

  describe('removeRegistration', function() {
    it('cfsession.removeRegistration should run res.forbidden if user not is isAuthenticated', function (done) {

      var req = {
        isAuthenticated: function() {
          return false;
        }
      };
      var res = {
        forbidden: function() {
          done();
        }
      };

      controller.removeRegistration(req, res);
    });

    it('cfsession.removeRegistration should run res.notFound if not find the session', function (done) {

      var cfsFindOne = we.db.models.cfsession.findOne;
      we.db.models.cfsession.findOne = function() {
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve();
        });
      }

      var req = {
        we: we,
        body: { cfsessionId: 10 },
        isAuthenticated: function() {
          return true;
        }
      };

      var res = {
        locals: {
          userCfregistration: {
            id: 20,
            status: 'registered'
          }
        },
        notFound: function() {
          we.db.models.cfsession.findOne = cfsFindOne;
          done();
        }
      };

      controller.removeRegistration(req, res);
    });

    it('cfsession.removeRegistration should run res.goTo after remove the cfsession', function (done) {

      var cfsFindOne = we.db.models.cfsession.findOne;
      we.db.models.cfsession.findOne = function() {
        return new we.db.Sequelize.Promise(function (resolve) {
          resolve({
            id: 10,
            removeSubscribers: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve()
              });
            }
          });
        });
      }

      var req = {
        we: we,
        body: { cfsessionId: 10 },
        isAuthenticated: function() {
          return true;
        }
      };

      var res = {
        locals: {
          userCfregistration: {
            id: 20,
            status: 'registered'
          }
        },
        addMessage: function(status, text) {
          assert.equal(status, 'success');
          assert.equal(text, 'cfsession.removeRegistration.success');
        },
        goTo: function() {
          we.db.models.cfsession.findOne = cfsFindOne;
          done();
        }
      };

      controller.removeRegistration(req, res);
    });

    it('cfsession.removeRegistration should run res.goTo after remove all cfsessions', function (done) {
      var req = {
        we: we,
        body: {},
        isAuthenticated: function() {
          return true;
        }
      };

      var res = {
        locals: {
          userCfregistration: {
            id: 20,
            status: 'registered',
            setSessions: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve({
                });
              });
            }
          }
        },
        addMessage: function(status, text) {
          assert.equal(status, 'success');
          assert.equal(text, 'cfsession.removeRegistration.success');
        },
        goTo: function() {
          done();
        }
      };

      controller.removeRegistration(req, res);
    });
  });

  describe('subscribers', function() {
    it('cfsession.subscribers should run res.notFound if not find the cfsession', function (done) {

      var req = {
        we: we,
        params: { cfsessionId: 11 }
      };

      var res = {
        locals: {
          Model: {
            findOne: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve(null);
              });
            }
          }
        },
        notFound: function() {
          done();
        }
      };

      controller.subscribers(req, res);
    });

    it('cfsession.subscribers should run res.ok after load all cfsession subscribers', function (done) {

      var req = {
        we: we,
        params: { cfsessionId: 11 }
      };

      var res = {
        locals: {
          Model: {
            findOne: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve({
                  id: 11,
                  getSubscribers: function() {
                    return new we.db.Sequelize.Promise(function (resolve) {
                      resolve([]);
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

      controller.subscribers(req, res);
    });
  });

  describe('exportSubscribers', function() {
    it('cfsession.exportSubscribers should run res.notFound if not find the cfsession', function (done) {

      var req = {
        we: we,
        params: { cfsessionId: 11 }
      };

      var res = {
        locals: {
          Model: {
            findOne: function() {
              return new we.db.Sequelize.Promise(function (resolve) {
                resolve(null);
              });
            }
          }
        },
        notFound: function() {
          done();
        }
      };

      controller.exportSubscribers(req, res);
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