var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var controller, we;

describe('controller_cfpage', function () {
  before(function (done) {
    controller = require('../../server/controllers/cfpage.js');
    we = helpers.getWe();

    done();
  });

  describe('find', function() {
    it('cfpage.find should find, count and run res.ok', function (done) {
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
    // it('cfpage.findOne should run res.goTo for html request', function (done) {

    //   var req = {
    //     params: {
    //       cfmenuId: 1
    //     },
    //     accepts: function(format) {
    //       assert.equal(format, 'html');
    //       return true;
    //     },
    //     method: 'GET', we: we
    //   };
    //   var res = {
    //     locals: {
    //       event: {
    //         id: 3
    //       },
    //       data: { id: 1 } },
    //     goTo: function(path) {
    //       assert.equal(path, '/event/3'+
    //         '/admin/cfmenu/1/edit');
    //       done();
    //     }
    //   };

    //   controller.findOne(req, res, function (){});
    // });

    // it('cfpage.findOne should run res.ok for json request', function (done) {

    //   var req = {
    //     params: {
    //       cfmenuId: 1
    //     },
    //     accepts: function(format) {
    //       assert.equal(format, 'html');
    //       return false; // is json
    //     },
    //     method: 'GET', we: we
    //   };
    //   var res = {
    //     locals: {
    //       event: { id: 3 },
    //       data: { id: 1 }
    //     },
    //     ok: function() {
    //       done();
    //     }
    //   };

    //   controller.findOne(req, res, function (){});
    // });
  });


  // describe('findOne', function() {
  //   it('cfpage.findOne should run next if not find the preloaded record', function (done) {
  //     var req = {};
  //     var res = { locals: { data: null } };

  //     controller.findOne(req, res, function (){
  //       done();
  //     });
  //   });
  //   it('cfpage.findOne should run res.goTo for html request', function (done) {

  //     var req = {
  //       params: {
  //         cfmenuId: 1
  //       },
  //       accepts: function(format) {
  //         assert.equal(format, 'html');
  //         return true;
  //       },
  //       method: 'GET', we: we
  //     };
  //     var res = {
  //       locals: {
  //         event: {
  //           id: 3
  //         },
  //         data: { id: 1 } },
  //       goTo: function(path) {
  //         assert.equal(path, '/event/3'+
  //           '/admin/cfmenu/1/edit');
  //         done();
  //       }
  //     };

  //     controller.findOne(req, res, function (){});
  //   });

  //   it('cfpage.findOne should run res.ok for json request', function (done) {

  //     var req = {
  //       params: {
  //         cfmenuId: 1
  //       },
  //       accepts: function(format) {
  //         assert.equal(format, 'html');
  //         return false; // is json
  //       },
  //       method: 'GET', we: we
  //     };
  //     var res = {
  //       locals: {
  //         event: { id: 3 },
  //         data: { id: 1 }
  //       },
  //       ok: function() {
  //         done();
  //       }
  //     };

  //     controller.findOne(req, res, function (){});
  //   });
  // });
});