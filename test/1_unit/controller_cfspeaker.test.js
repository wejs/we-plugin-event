var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var controller, we;

describe('controller_cfspeaker', function () {
  before(function (done) {
    controller = require('../../server/controllers/cfspeaker.js');
    we = helpers.getWe();

    done();
  });

  describe('find', function() {
    it('cfspeaker.find should find, count and run res.ok', function (done) {
      var req = {};
      var res = {
        locals: {
          event: { id: 10 },
          data: null,
          metadata: {},
          query: {
            where: {
              something: 'the query'
            }
          },
          Model: {
            findAll: function(opts) {
              assert.equal(opts.where.something, res.locals.query.where.something);

              return new we.db.Sequelize.Promise(function (resolve) {
                resolve([]);
              });
            },
            count: function(opts) {
              assert.equal(opts, res.locals.query);

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
  });

});