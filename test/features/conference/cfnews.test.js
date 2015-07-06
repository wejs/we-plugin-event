var assert = require('assert');
var request = require('supertest');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var async = require('async');
var _ = require('lodash');
var http;
var we;
var agent;

describe('cfnewsFeature', function() {
  var salvedUser, salvedUserPassword, authenticatedRequest;
  var salvedConference, salvedImage;

  before(function (done) {
    http = helpers.getHttp();
    agent = request.agent(http);
    we = helpers.getWe();
    we.config.acl.disabled = true;

    async.series([
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
      function createImage(done) {
        // upload one stub image:
        request(http)
        .post('/api/v1/image')
        .attach('image', stubs.getImageFilePath())
        .end(function (err, res) {
          if(err) throw err;
          salvedImage = res.body.image[0];
          done(err);
        });
      },
      function createConference(done) {
        var cf = stubs.conferenceStub();
        we.db.models.conference.create(cf)
        .then(function (scf) {
          salvedConference = scf;
          done();
        }).catch(done);
      }
    ], done);
  });

  describe('cfnewsCRUD', function() {
    it ('post /conference/:conferenceId/admin/cfnews/create should create one cfnews', function (done) {
      var cf = {
        title: 'one test title',
        text: 'one test text',
        featuredImage: [ 'null', salvedImage.id ]
      }
      authenticatedRequest
      .post('/conference/'+salvedConference.id+'/admin/news/create')
      .send(cf)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        assert(res.body.cfnews);
        assert(res.body.cfnews[0]);
        assert(res.body.cfnews[0].id);
        assert.equal(res.body.cfnews[0].title, cf.title);

        done();
      });
    });
  });


});