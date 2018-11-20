var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var we, Widget;

describe('widget_we-cf-video', function () {

  before(function (done) {
    we = helpers.getWe();
    Widget = we.plugins['we-plugin-widget'].widgetTypes['we-cf-video'];
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


  it('viewMiddleware should run next if not find the cfvideo', function (done) {

    var findOne = we.db.models.cfvideo.findOne;
    we.db.models.cfvideo.findOne = function() {
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

      we.db.models.cfvideo.findOne = findOne;
      done();
    });
  });

  it('viewMiddleware should set record before run next', function (done) {

    var findOne = we.db.models.cfvideo.findOne;
    we.db.models.cfvideo.findOne = function() {
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
      assert(widget.cfvideo);
      assert.equal(widget.cfvideo.id, 11);

      we.db.models.cfvideo.findOne = findOne;
      done();
    });
  });

  it('beforeSave should set configuration vid and run next', function (done) {

    var req = {
      we: we,
      body: { vid: 1231 }
    };
    var res = {};

    Widget.beforeSave(req, res, function (err) {
      if (err) return done(err);

      assert(req.body.configuration.vid, 1231);

      done();
    });
  });

});