var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var we, Widget;

describe('widget_we-cf-topics', function () {

  before(function (done) {
    we = helpers.getWe();
    Widget = we.plugins['we-plugin-widget'].widgetTypes['we-cf-topics'];

    done();
  });

  it('viewMiddleware should set the event if current event have topics', function (done) {
    var req = {
      we: we
    };
    var res = {
      locals: { event: {
        id: 12,
        topics: [{ id: 1 }]
      }}
    };

    var widget = { dataValues: {} };

    Widget.viewMiddleware(widget, req, res, function (err) {
      if (err) return done(err);
      assert(!widget.hide);
      assert(widget.topics);
      done();
    });
  });

  it('viewMiddleware should set widget.hide if dont have topics', function (done) {
    var req = {
      we: we
    };
    var res = {
      locals: { event: {
        id: 12
      }}
    };

    var widget = { dataValues: {} };

    Widget.viewMiddleware(widget, req, res, function (err) {
      if (err) return done(err);
      assert.equal(widget.hide, true);
      assert(!widget.topics);
      done();
    });
  });

});