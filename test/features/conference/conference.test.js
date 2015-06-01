var assert = require('assert');
var request = require('supertest');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var async = require('async');
var _ = require('lodash');
var http;
var we;
var agent;

describe('conferenceFeature', function() {
  var salvedUser, salvedUserPassword, authenticatedRequest;

  before(function (done) {
    http = helpers.getHttp();
    agent = request.agent(http);
    we = helpers.getWe();
    we.config.acl.disabled = true;

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
    })
  });

  describe('conferenceCRUD', function() {
    it ('post /conference should create one conference with unpublished status', function (done) {
      var cf = stubs.conferenceStub();
      authenticatedRequest.post('/conference')
      .send(cf)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        assert(res.body.conference);
        assert(res.body.conference[0]);
        assert(res.body.conference[0].id);
        assert.equal(res.body.conference[0].title, cf.title);
        done();
      });
    });

    it ('get /conference/:id should get one conference', function (done) {
      var cf = stubs.conferenceStub();
      we.db.models.conference.create(cf).then(function (scf) {
        authenticatedRequest.get('/conference/'+ scf.id)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(res.body.conference);
          assert(res.body.conference[0]);
          assert.equal(res.body.conference[0].id, scf.id);
          assert.equal(res.body.conference[0].title, cf.title);
          done();
        });
      });
    });

    it ('get /conference should get conference list', function (done) {
      var cfs = [
        stubs.conferenceStub(), stubs.conferenceStub(), stubs.conferenceStub()
      ];

      we.db.models.conference.bulkCreate(cfs).then(function () {
        request(http)
        .get('/conference')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(res.body.conference);
          assert(res.body.conference.length >= 3);

          done();
        });
      });
    });

    it ('put /conference/:id should update one conference', function (done) {
      var cf = stubs.conferenceStub();
      we.db.models.conference.create(cf).then(function (scf) {
        var newCfData = {
          title: 'updated title :)',
          about: 'Mussum ipsum cacilds, vidis litro abertis. Consetis adipiscings elitis.',
        };
        authenticatedRequest.put('/conference/'+ scf.id)
        .send(newCfData)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(res.body.conference);
          assert(res.body.conference[0]);
          assert.equal(res.body.conference[0].id, scf.id);
          assert.equal(res.body.conference[0].title, newCfData.title);
          assert.equal(res.body.conference[0].about, newCfData.about);
          assert(res.body.conference[0].title || scf.title);
          assert(res.body.conference[0].about || scf.about);
          done();
        });
      });
    });

    it ('delete /conference/:id should delete one conference', function (done) {
      var cf = stubs.conferenceStub();
      we.db.models.conference.create(cf).then(function (scf) {
        authenticatedRequest.delete('/conference/'+ scf.id)
        .set('Accept', 'application/json')
        .expect(204)
        .end(function (err, res) {
          if (err) throw err;
          assert(!res.body.conference);
          we.db.models.conference.findById(scf.id).then(function (scf) {
            assert( _.isEmpty(scf) );
            done();
          });
        });
      });
    });

  });

});