var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var we, Widget;

describe('widget_we-cf-search-form', function () {

  before(function (done) {
    we = helpers.getWe();
    Widget = we.view.widgets['we-cf-search-form'];
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
});