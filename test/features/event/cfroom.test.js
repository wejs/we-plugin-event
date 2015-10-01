var assert = require('assert');
var request = require('supertest');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var stubs = require('we-test-tools').stubs;
var http;
var we;
var agent;

function cfroomStub() {
  return {
    name: 'One room test'
  };
}

describe('cfRoomFeatures', function() {
  var salvedUser, salvedUserPassword, authenticatedRequest;
  var salvedConference, salvedImage;

  before(function (done) {
    http = helpers.getHttp();
    agent = request.agent(http);
    we = helpers.getWe();
    we.config.acl.disabled = true;

    we.utils.async.series([
      function createAuthenticatedUser(done) {
        var userStub = stubs.userStub();
        helpers.createUser(userStub, function(err, user) {
          if (err) throw err;
          salvedUser = user;
          salvedUserPassword = userStub.password;
          // login user and save the browser
          authenticatedRequest = request.agent(http);
          authenticatedRequest.post('/login')
          .set('Accept', 'application/json')
          .send({
            email: salvedUser.email,
            password: salvedUserPassword
          })
          .expect(200)
          .set('Accept', 'application/json')
          .end(done);
        });
      },
      function createConference(done) {
        var cf = stubs.eventStub();
        we.db.models.event.create(cf)
        .then(function (scf) {
          salvedConference = scf;
          done();
        }).catch(done);
      }
    ], done);
  });

  describe('CRUD', function() {
    it ('post /event/:eventId/cfroom/create should create one cfroom', function (done) {
      var cf = {
        name: 'One room test'
      }
      authenticatedRequest
      .post('/event/'+salvedConference.id+'/cfroom/create')
      .send(cf)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        assert(res.body.cfroom);
        assert(res.body.cfroom[0]);
        assert(res.body.cfroom[0].id);
        assert.equal(res.body.cfroom[0].title, cf.title);

        done();
      });
    });

    it ('get /event/:eventId/admin/room should get room list', function (done) {
      var cf = [
        cfroomStub(),
        cfroomStub(),
        cfroomStub()
      ];
      we.db.models.cfroom.bulkCreate(cf)
      .then(function () {

        authenticatedRequest
        .get('/event/' + salvedConference.id + '/admin/room')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(res.body.cfroom);
          assert(res.body.cfroom.length >= 3);
          done();
        });
      }).catch(done);
    });

    it ('post /event/:eventId/admin/cfroom/:id/edit should update one room', function (done) {
      var cf = {
        name: 'One room test'
      }
      we.db.models.cfroom.create(cf)
      .then(function (r) {
        assert(r.id);
        var newValues = { title: 'one new test title' };
        authenticatedRequest
        .post('/event/' + salvedConference.id + '/admin/cfroom/' + r.id + '/edit')
        .send(newValues)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(res.body.cfroom);
          assert(res.body.cfroom[0]);
          assert.equal(res.body.cfroom[0].id, r.id);
          assert.equal(res.body.cfroom[0].title, newValues.title);
          assert.equal(res.body.cfroom[0].text, cf.text);
          done();
        });
      }).catch(done);
    });

    it ('post /event/:eventId/admin/cfroom/:id/delete should delete one room', function (done) {
      var cf = {
        name: 'One room test'
      }
      we.db.models.cfroom.create(cf)
      .then(function (r) {
        assert(r.id);
        authenticatedRequest
        .post('/event/' + salvedConference.id + '/admin/cfroom/' + r.id + '/delete')
        .set('Accept', 'application/json')
        .expect(204)
        .end(function (err) {
          if (err) throw err;
          we.db.models.cfroom.findById(r.id)
          .then(function (result){
            assert(!result);
            done();
          }).catch(done);
        });
      }).catch(done);
    });
  });
});