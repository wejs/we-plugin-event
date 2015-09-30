var assert = require('assert');
var request = require('supertest');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var stubs = require('we-test-tools').stubs;
var http;
var we;
var agent;

function cfnewsStub(salvedImageId){
  return {
    title: 'one test title',
    text: 'one test text',
    featuredImage: [ 'null', salvedImageId]
  };
}

describe('cfnewsFeature', function() {
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
    it ('post /event/:eventId/cfnews/create should create one cfnews', function (done) {
      var cf = {
        title: 'one test title',
        text: 'one test text',
        featuredImage: [ 'null', salvedImage.id ]
      }
      authenticatedRequest
      .post('/event/'+salvedConference.id+'/cfnews/create')
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

    it ('get /event/:eventId/admin/news should get news list', function (done) {
      var cf = [
        cfnewsStub(salvedImage.id),
        cfnewsStub(salvedImage.id),
        cfnewsStub(salvedImage.id)
      ];
      we.db.models.cfnews.bulkCreate(cf)
      .then(function () {

        authenticatedRequest
        .get('/event/' + salvedConference.id + '/admin/news')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(res.body.cfnews);
          assert(res.body.cfnews.length >= 3);
          done();
        });
      }).catch(done);
    });

    it ('post /event/:eventId/admin/cfnews/:id/edit should update one news', function (done) {
      var cf = {
        title: 'one test title',
        text: 'one test text',
        featuredImage: [ 'null', salvedImage.id ]
      }
      we.db.models.cfnews.create(cf)
      .then(function (r) {
        assert(r.id);
        var newValues = { title: 'one new test title' };
        authenticatedRequest
        .post('/event/' + salvedConference.id + '/admin/cfnews/' + r.id + '/edit')
        .send(newValues)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(res.body.cfnews);
          assert(res.body.cfnews[0]);
          assert.equal(res.body.cfnews[0].id, r.id);
          assert.equal(res.body.cfnews[0].title, newValues.title);
          assert.equal(res.body.cfnews[0].text, cf.text);
          done();
        });
      }).catch(done);
    });

    it ('post /event/:eventId/admin/cfnews/:id/delete should delete one news', function (done) {
      var cf = {
        title: 'one test title',
        text: 'one test text',
        featuredImage: [ 'null', salvedImage.id ]
      }
      we.db.models.cfnews.create(cf)
      .then(function (r) {
        assert(r.id);
        authenticatedRequest
        .post('/event/' + salvedConference.id + '/admin/cfnews/' + r.id + '/delete')
        .set('Accept', 'application/json')
        .expect(204)
        .end(function (err) {
          if (err) throw err;
          we.db.models.cfnews.findById(r.id)
          .then(function (result){
            assert(!result);
            done();
          }).catch(done);
        });
      }).catch(done);
    });
  });
});