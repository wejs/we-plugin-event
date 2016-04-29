var assert = require('assert');
var helpers = require('we-test-tools').helpers;
var we, lib;

describe('lib_widgetUtils', function () {

  before(function (done) {
    lib = require('../../lib/widgetUtils.js');
    we = helpers.getWe();
    done();
  });

  it('checkIfIsValidContext should return false if not are in event context and true if are in', function (done) {
    assert.equal(lib.checkIfIsValidContext(), false);
    assert.equal(lib.checkIfIsValidContext('event-12'), true);
    done();
  });

  it('isAvaibleForSelection should return false if not are in event context and true if are in', function (done) {
    var req = {
      res: {
        locals: {
          widgetContext: null
        }
      }
    }
    assert.equal(lib.isAvaibleForSelection(req), false);
    req.res.locals.widgetContext = 'event-1';
    assert.equal(lib.isAvaibleForSelection(req), true);
    done();
  });

  it('beforeSave should run next if context are in req.body', function (done) {

    var req = {
      we: we,
      body: { context: 'event-12' }
    };
    var res = { locals: {} };

    lib.beforeSave(req, res, function (err) {
      if (err) return done(err);
      done();
    });
  });

  it('beforeSave should run next with error if context not are set', function (done) {

    var req = {
      we: we,
      body: { context: null }
    };
    var res = { locals: { __: we.i18n.__ }};

    lib.beforeSave(req, res, function (err) {
      assert(err);
      done();
    });
  });

  it('renderVisibilityField should return visibility field with in-context value', function (done) {

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

    var text = lib.renderVisibilityField(widget, 'event-12', req, res);
    assert(text.indexOf('name="visibility"') > -1);
    assert(text.indexOf('value="in-context"') > -1);

    done();
  });
});