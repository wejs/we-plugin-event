var assert = require('assert');
var request = require('supertest');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var http;
var we;
var agent;

describe('cfvideoFeature', function() {
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

        we.db.models.event.create(stubs.eventStub())
        .then(function (c) {
          cf = c;
          done();
        }).catch(done);
      });
    });
  });


  describe('cfvideoCRUD', function() {
    it ('post /event/:eventId/cfvideo/create?redirectTo=/redirecttome should create one video and redirect', function (done) {
      var cfv = { title: 'One video', url: 'https://www.youtube.com/watch?v=escUU8iBPpo' };

      authenticatedRequest.post('/event/'+cf.id+'/cfvideo/create?redirectTo=/redirecttome')
      .send(cfv)
      .expect(302)
      .end(function (err, res) {
        if (err) throw err;
        assert.equal(res.headers.location, '/redirecttome');
        done();
      });
    });

    it ('post /event/:eventId/cfvideo/:id/edit?redirectTo=/redirecttome should edit one video and redirect', function (done) {
      we.db.models.cfvideo.create({
        title: 'One video',
        url: 'https://www.youtube.com/watch?v=escUU8iBPpo',
        eventId: cf.id
      }).then(function(cfv){
        cfv.title = 'changed title';
        // then edit
        authenticatedRequest.post('/event/'+cf.id+'/cfvideo/'+cfv.id+'/edit?redirectTo=/redirecttome')
        .send(cfv)
        .expect(302)
        .end(function (err, res) {
          if (err) throw err;

          assert.equal(res.headers.location, '/redirecttome');
          done();
        });
      }).catch(done);
    });

    it ('post /event/:eventId/cfvideo/create should create one video and return json', function (done) {
      var cfv = { title: 'One video :)', url: 'https://www.youtube.com/watch?v=escUU8iBPpo' };

      authenticatedRequest.post('/event/'+cf.id+'/cfvideo/create')
      .send(cfv)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;

        assert(res.body.cfvideo[0]);
        assert(res.body.cfvideo[0].id);
        assert(res.body.cfvideo[0].provider);
        assert(res.body.cfvideo[0].idInProvider);
        assert(res.body.cfvideo[0].embedUrl);
        assert(res.body.cfvideo[0].thumbnails);

        assert.equal(res.body.cfvideo[0].url, cfv.url);
        assert.equal(res.body.cfvideo[0].title, cfv.title);

        done();
      });
    });
  });
});