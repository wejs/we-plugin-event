var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var controller, we;

describe('controller_cfmenu', function () {
  before(function (done) {
    controller = require('../../server/controllers/cfmenu.js');
    we = helpers.getWe();
    done();
  });

  describe('findOne', function() {
    it('cfmenu.findOne should run next if not find the preloaded record', function (done) {
      var req = {};
      var res = { locals: { data: null } };

      controller.findOne(req, res, function (){
        done();
      });
    });
    it('cfmenu.findOne should run res.goTo for html request', function (done) {

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

    it('cfmenu.findOne should run res.ok for json request', function (done) {

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