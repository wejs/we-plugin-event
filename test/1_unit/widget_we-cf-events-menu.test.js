var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var we, Widget;

describe('widget_we-cf-events-menu', function () {

  before(function (done) {
    we = helpers.getWe();
    Widget = we.view.widgets['we-cf-events-menu'];
    // dont show erros with wrong date formats
    we.utils.moment.suppressDeprecationWarnings = true;

    done();
  });

  it('checkIfIsValidContext should return false if have context and true if dont', function (done) {
    assert.equal(Widget.checkIfIsValidContext('event-1'), false);
    assert.equal(Widget.checkIfIsValidContext(), true);
    done();
  });

  it('isAvaibleForSelection should return true if eventSearch is true', function (done) {
    var req = { res: { locals: { eventSearch: true } } };
    assert.equal(Widget.isAvaibleForSelection(req), true);
    req.res.locals.eventSearch = false;
    assert.equal(Widget.isAvaibleForSelection(req), false);
    done();
  });

  it('renderVisibilityField should return visibility field with in-page value', function (done) {

    var req = {
      we: we
    };
    var res = {
      locals: { __: we.i18n.__ }
    };

    var widget = {
      configuration: { nid: 11 },
      dataValues: {}
    };

    var text = Widget.renderVisibilityField(widget, null, req, res);
    assert(text.indexOf('name="visibility"') > -1);
    assert(text.indexOf('value="in-page"') > -1);

    done();
  });

  it('viewMiddleware should set menu and load terms', function (done) {

    var query = we.db.defaultConnection.query;
    we.db.defaultConnection.query = function() {
      return new we.db.Sequelize.Promise(function (resolve) {
        resolve([[{
          id: 10,
          text: 'Live'
        }]]);
      });
    }

    var req = {
      __: we.i18n.__,
      we: we,
      isAuthenticated: function() {
        return true;
      }
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

      assert(widget.navigationMenu);
      assert(widget.terms);

      we.db.defaultConnection.query = query;
      done();
    });
  });

});