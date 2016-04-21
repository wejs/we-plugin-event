var assert = require('assert');
var sinon = require('sinon');
var stubs = require('we-test-tools').stubs;
var helpers = require('we-test-tools').helpers;
var we, helper;

describe('helper_we-cf-registration-btn', function () {
  var salvedConference;

  before(function (done) {
    we = helpers.getWe();
    helper = require('../../server/helpers/we-cf-registration-btn.js')(we, we.view);

    var cf = stubs.eventStub();
    we.db.models.event.create(cf)
    .then(function (scf) {
      salvedConference = scf;
      done();
    }).catch(done);
  });

  it('helper should render registration btn with open status', function (done) {
    // open = dont have userCfregistration and are before event end

    var result = helper.bind({})({
      hash: {
        event: salvedConference,
        userCfregistration: {},
        locals: {
          __: we.i18n.__
        },
        class: '',
        classClosedAfter: '',
        classClosedNoVacancies: '',
        classOpen: '',
        classClosedBefore: '',
        classClosed: ''
      }
    });
    assert.equal(result.string, '<a class="btn btn-default cf-btn-open" href="/event/'+
        salvedConference.id+
        '/register" >event.btn.open</a>');

    done();
  });

  it('helper should render registration btn with closed_after status', function (done) {
    // closed_after = event end date is more before than now
    var oldDate = salvedConference.registrationEndDate;
    salvedConference.registrationEndDate = we.utils.moment(new Date()).subtract(1, 'months');

    var result = helper.bind({})({
      hash: {
        event: salvedConference,
        userCfregistration: {},
        locals: {
          __: we.i18n.__
        },
        class: '',
        classClosedAfter: '',
        classClosedNoVacancies: '',
        classOpen: '',
        classClosedBefore: '',
        classClosed: ''
      }
    });

    assert.equal(result.string, '<a class="btn btn-danger cf-btn-closed_after" href="#"  '+
        'disabled="disabled" >event.btn.closed_after</a>');

    salvedConference.registrationEndDate = oldDate;

    done();
  });

  it('helper should render registration btn with closed_no_vacancies status', function (done) {
    // closed_no_vacancies = registration count is more than vacancies
    salvedConference.vacancies = 2;
    salvedConference.registrationCount = 2;

    var result = helper.bind({})({
      hash: {
        event: salvedConference,
        userCfregistration: {},
        locals: {
          __: we.i18n.__
        },
        class: '',
        classClosedAfter: '',
        classClosedNoVacancies: '',
        classOpen: '',
        classClosedBefore: '',
        classClosed: ''
      }
    });

    assert.equal(result.string, '<a class="btn btn-danger cf-btn-closed_no_vacancies" href="#"  disabled="disabled" '+
        '>event.btn.closed_no_vacancies</a>');

    done();
  });

  it('helper should render registration btn with open status', function (done) {
    // open status = is open and have vacancies

    salvedConference.vacancies = 2;
    salvedConference.registrationCount = 0;

    var result = helper.bind({})({
      hash: {
        event: salvedConference,
        userCfregistration: {},
        locals: {
          __: we.i18n.__
        },
        class: '',
        classClosedAfter: '',
        classClosedNoVacancies: '',
        classOpen: '',
        classClosedBefore: '',
        classClosed: ''
      }
    });

    assert.equal(result.string, '<a class="btn btn-default cf-btn-open" href="/event/'+salvedConference.id+
      '/register" >event.btn.open</a>');

    done();
  });

  it('helper should render registration btn with closed_before status', function (done) {
    var oldDate = salvedConference.registrationStartDate;
    salvedConference.registrationStartDate = we.utils.moment(new Date()).add(1, 'months');

    salvedConference.startDate = 2;
    salvedConference.registrationCount = 0;

    var result = helper.bind({})({
      hash: {
        event: salvedConference,
        userCfregistration: {},
        locals: {
          __: we.i18n.__
        },
        class: '',
        classClosedAfter: '',
        classClosedNoVacancies: '',
        classOpen: '',
        classClosedBefore: '',
        classClosed: ''
      }
    });

    assert.equal(result.string, '<a class="btn btn-danger cf-btn-closed_before" href="#"  disabled="disabled" >'+
      'event.btn.closed_before</a>');

    salvedConference.registrationStartDate = oldDate;

    done();
  });

  it('helper should render registration btn with closed status', function (done) {
    var oldDate = salvedConference.registrationStartDate;
    salvedConference.registrationStartDate = null;

    salvedConference.startDate = 2;
    salvedConference.registrationCount = 0;

    var result = helper.bind({})({
      hash: {
        event: salvedConference,
        userCfregistration: {},
        locals: {
          __: we.i18n.__
        },
        class: '',
        classClosedAfter: '',
        classClosedNoVacancies: '',
        classOpen: '',
        classClosedBefore: '',
        classClosed: ''
      }
    });

    assert.equal(result.string, '<a class="btn btn-danger cf-btn-closed" href="#"  disabled="disabled" '+
      '>event.btn.closed</a>');

    salvedConference.registrationStartDate = oldDate;

    done();
  });

  it('helper should render registration btn with registered status', function (done) {

    var result = helper.bind({})({
      hash: {
        event: salvedConference,
        userCfregistration: {
          status: 'registered'
        },
        locals: {
          __: we.i18n.__
        },
        class: '',
        classClosedAfter: '',
        classClosedNoVacancies: '',
        classOpen: '',
        classClosedBefore: '',
        classClosed: ''
      }
    });

    assert.equal(result.string, '<a class="btn btn-default cf-btn-registered" href="/event/'+
      salvedConference.id+'/register"'+
      ' >event.btn.registered</a>');

    done();
  });


});