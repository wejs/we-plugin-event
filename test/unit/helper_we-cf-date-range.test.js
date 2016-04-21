var assert = require('assert');
var sinon = require('sinon');
var helpers = require('we-test-tools').helpers;
var we, helper;

describe('helper_we-cf-date-range', function () {

  before(function (done) {
    we = helpers.getWe();
    helper = require('../../server/helpers/we-cf-date-range.js')(we, we.view);
    // dont show erros with wrong date formats
    we.utils.moment.suppressDeprecationWarnings = true;

    done();
  });

  it('helper should return empty string for invalid data', function (done) {
    var result = helper.bind({})({
      hash: {
        __: we.i18n.__,
        start: '2014-04-25T01:32:21.196Z', // valid
        end: 'something invalid' // invalid
      }
    });
    assert.equal(result, '');

    done();
  });

  it('helper should run node i18n event.date.range with valid date params', function (done) {

    sinon.spy(we.i18n, '__');

    var result = helper.bind({})({
      hash: {
        __: we.i18n.__,
        start: '2014-04-25T01:32:21.196Z',
        end: '2014-04-25T01:32:21.196Z'
      }
    });

    assert.equal(result, 'event.date.range');
    assert(we.i18n.__.called);

    we.i18n.__.calledWith('event.date.range', {
      start: '24/04',
      end: '24/04',
      yearStart: '2014',
      yearEnd: '2014'
    });

    we.i18n.__.restore();

    done();
  });

});