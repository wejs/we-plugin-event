var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var we, Widget;

describe('widget_we-cf-news', function () {

  before(function (done) {
    we = helpers.getWe();
    Widget = we.plugins['we-plugin-widget'].widgetTypes['we-cf-news'];
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

    Widget.viewMiddleware(widget, req, res, function (err) {
      if (err) return done(err);

      assert.equal(widget.hide, true);
      done();
    });
  });


  it('viewMiddleware should run next if not find the cfnews', function (done) {

    var findOne = we.db.models.cfnews.findOne;
    we.db.models.cfnews.findOne = function() {
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

      we.db.models.cfnews.findOne = findOne;
      done();
    });
  });

  it('viewMiddleware should set record before run next', function (done) {

    var findOne = we.db.models.cfnews.findOne;
    we.db.models.cfnews.findOne = function() {
      return new we.db.Sequelize.Promise(function (resolve) {
        resolve({
          id: 11
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

    var widget = {
      configuration: { nid: 11 },
      dataValues: {}
    };

    Widget.viewMiddleware(widget, req, res, function (err) {
      if (err) return done(err);

      assert(!widget.hide);
      assert(widget.record);
      assert.equal(widget.record.id, 11);

      we.db.models.cfnews.findOne = findOne;
      done();
    });
  });

  it('beforeSave should set configuration nid and run next', function (done) {

    var req = {
      we: we,
      body: { nid: 1231 }
    };
    var res = {};

    Widget.beforeSave(req, res, function (err) {
      if (err) return done(err);

      assert(req.body.configuration.nid, 1231);

      done();
    });
  });

});