var assert = require('assert');
var sinon = require('sinon');
var helpers = require('we-test-tools').helpers;
var we, Widget;

describe('widget_we-cf-schendule', function () {

  before(function (done) {
    we = helpers.getWe();
    Widget = we.view.widgets['we-cf-schedule'];
    // dont show erros with wrong date formats
    we.utils.moment.suppressDeprecationWarnings = true;

    done();
  });

  it('viewMiddleware should run next if not find the event id', function (done) {
    var req = {
      we: we
    };
    var res = {
      locals: {}
    };

    var widget = { dataValues: {} };

    Widget.viewMiddleware(widget, req, res, function(){
      done();
    });
  });


  it('viewMiddleware should load cfsession and build data before run next', function (done) {

    var findAndCountAll = we.db.models.cfsession.findAndCountAll;
    we.db.models.cfsession.findAndCountAll = function() {
      return new we.db.Sequelize.Promise(function (resolve) {
        resolve({
          count: 2,
          rows: [{
            id: 1,
            startDate: new Date(),
            endDate: new Date(),
          }, {
            id: 2
          }]
        });
      });
    }

    var req = {
      __: we.i18n.__,
      we: we
    };
    var res = {
      locals: { event: { id: 12 }}
    };

    var widget = { dataValues: {} };

    Widget.viewMiddleware(widget, req, res, function(err) {
      if (err) return done(err);

      assert(widget.days);
      assert(widget.record);
      assert(widget.count);

      we.db.models.cfsession.findAndCountAll = findAndCountAll;
      done();
    });
  });

});