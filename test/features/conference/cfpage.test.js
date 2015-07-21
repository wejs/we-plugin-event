var assert = require('assert');
var request = require('supertest');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var async = require('async');
var _ = require('lodash');
var http;
var we;
var agent;

describe('cfpageFeature', function() {
  var cf, salvedUser, salvedUserPassword, authenticatedRequest;

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
      .end(function(err){
        if (err) return done(err);

        we.db.models.conference.create(stubs.conferenceStub())
        .then(function (c) {
          cf = c;
          done();
        }).catch(done);
      });
    });
  });


  describe('cfpageCRUD', function() {
    it ('post /conference/:conferenceId/cfpage/create?redirectTo=/redirecttome should create one page and redirect', function (done) {
      var cfp = { title: 'One page' };

      authenticatedRequest.post('/conference/'+cf.id+'/cfpage/create?redirectTo=/redirecttome')
      .send(cfp)
      .expect(302)
      .end(function (err, res) {
        if (err) throw err;
        assert.equal(res.headers.location, '/redirecttome');
        done();
      });
    });

   it ('post /conference/:conferenceId/cfpage/:id/edit?redirectTo=/redirecttome should edit one page and redirect', function (done) {
      we.db.models.cfpage.create({
        title: 'One page',
        conferenceId: cf.id
      }).then(function(cfp){
        cfp.title = 'changed title';
        // then edit
        authenticatedRequest.post('/conference/'+cf.id+'/cfpage/'+cfp.id+'/edit?redirectTo=/redirecttome')
        .send(cfp)
        .expect(302)
        .end(function (err, res) {
          if (err) throw err;

          assert.equal(res.headers.location, '/redirecttome');
          done();
        });
      }).catch(done);
    });
  });
});