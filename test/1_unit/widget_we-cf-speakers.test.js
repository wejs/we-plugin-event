var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var we, Widget;

describe('widget_we-cf-speakers', function () {

  before(function (done) {
    we = helpers.getWe();
    Widget = we.plugins['we-plugin-widget'].widgetTypes['we-cf-speakers'];
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

    Widget.viewMiddleware(widget, req, res, function (err) {
      if (err) return done(err);

      assert.equal(widget.hide, true);
      done();
    });
  });


  it('viewMiddleware should run next if not find the cfspeakers', function (done) {

    var findAll = we.db.models.cfspeaker.findAll;
    we.db.models.cfspeaker.findAll = function() {
      return new we.db.Sequelize.Promise(function (resolve) {
        resolve();
      });
    }

    var req = {
      __: we.i18n.__,
      we: we
    };
    var res = {
      locals: { event: { id: 12 }}
    };

    var widget = {
      configuration: { nid: 111 },
      dataValues: {}
    };

    Widget.viewMiddleware(widget, req, res, function (err) {
      if (err) return done(err);

      assert(widget.hide);

      we.db.models.cfspeaker.findAll = findAll;
      done();
    });
  });

  it('viewMiddleware should set speakers before run next', function (done) {

    var findAll = we.db.models.cfspeaker.findAll;
    we.db.models.cfspeaker.findAll = function() {
      return new we.db.Sequelize.Promise(function (resolve) {
        resolve([{
          id: 11
        }]);
      });
    }

    var req = {
      __: we.i18n.__,
      we: we
    };
    var res = {
      locals: { event: { id: 12 }}
    };

    var widget = {
      configuration: { nid: 11 },
      dataValues: {}
    };

    Widget.viewMiddleware(widget, req, res, function (err) {
      if (err) return done(err);

      assert(!widget.hide);
      assert(widget.speakers);

      we.db.models.cfspeaker.findAll = findAll;
      done();
    });
  });
});