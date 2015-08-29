var assert = require('assert');
var request = require('supertest');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var http;
var we;
var agent;

function cfregistrationtypeStub(cfId){
  return {
    name: 'one test title',
    description: 'one test text',
    conferenceId: cfId
  };
}

describe('cfregistrationtypeFeature', function() {
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
        var cf = stubs.conferenceStub();
        we.db.models.conference.create(cf)
        .then(function (scf) {
          salvedConference = scf;
          done();
        }).catch(done);
      }
    ], done);
  });

  describe('CRUD', function() {
    it ('post /conference/:conferenceId/admin/cfregistrationtype/create should create one registration type', function (done) {
      var cfrt = cfregistrationtypeStub();
      authenticatedRequest
      .post('/conference/'+salvedConference.id+'/admin/cfregistrationtype/create')
      .send(cfrt)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        assert(res.body.cfregistrationtype);
        assert(res.body.cfregistrationtype[0]);
        assert(res.body.cfregistrationtype[0].id);
        assert.equal(res.body.cfregistrationtype[0].name, cfrt.name);
        assert.equal(res.body.cfregistrationtype[0].requireValidation, false);
        done();
      });
    });

    it ('get /conference/:conferenceId/admin/cfregistrationtype/:id should get one registration type', function (done) {
      var cfrt = cfregistrationtypeStub(salvedConference.id);
      we.db.models.cfregistrationtype.create(cfrt)
      .then(function (r) {
        assert(r.id);

        authenticatedRequest
        .get('/conference/'+salvedConference.id+'/admin/cfregistrationtype/'+r.id)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(res.body.cfregistrationtype);
          assert(res.body.cfregistrationtype[0]);
          assert(res.body.cfregistrationtype[0].id);
          assert.equal(res.body.cfregistrationtype[0].name, cfrt.name);
          assert.equal(res.body.cfregistrationtype[0].requireValidation, false);
          done();
        });
      }).catch(done);
    });

    it ('get /conference/:conferenceId/admin/cfregistrationtype should get registration type list', function (done) {
      var cfrts = [
        cfregistrationtypeStub(salvedConference.id),
        cfregistrationtypeStub(salvedConference.id),
        cfregistrationtypeStub(salvedConference.id)
      ];
      we.db.models.cfregistrationtype.bulkCreate(cfrts)
      .then(function () {

        authenticatedRequest
        .get('/conference/'+salvedConference.id+'/admin/cfregistrationtype')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(res.body.cfregistrationtype);
          assert(res.body.cfregistrationtype.length > 3);
          done();
        });
      }).catch(done);
    });

    it ('post /conference/:conferenceId/admin/cfregistrationtype/:id/edit should update one registrationtype', function (done) {
      var cfrt = cfregistrationtypeStub(salvedConference.id);
      we.db.models.cfregistrationtype.create(cfrt)
      .then(function (r) {
        assert(r.id);
        var newValues = { name: 'one new test name' };
        authenticatedRequest
        .post('/conference/'+salvedConference.id+'/admin/cfregistrationtype/'+r.id+'/edit')
        .send(newValues)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(res.body.cfregistrationtype);
          assert(res.body.cfregistrationtype[0]);
          assert.equal(res.body.cfregistrationtype[0].id, r.id);
          assert.equal(res.body.cfregistrationtype[0].name, newValues.name);
          assert.equal(res.body.cfregistrationtype[0].description, cfrt.description);
          assert.equal(res.body.cfregistrationtype[0].requireValidation, false);
          done();
        });
      }).catch(done);
    });

    it ('post /conference/:conferenceId/admin/cfregistrationtype/:id/delete should delete one registrationtype', function (done) {
      var cfrt = cfregistrationtypeStub(salvedConference.id);
      we.db.models.cfregistrationtype.create(cfrt)
      .then(function (r) {
        assert(r.id);

        authenticatedRequest
        .post('/conference/'+salvedConference.id+'/admin/cfregistrationtype/'+r.id+'/delete')
        .set('Accept', 'application/json')
        .expect(204)
        .end(function (err) {
          if (err) throw err;
          // check if this registration type is deleted
          we.db.models.cfregistrationtype.findById(r.id)
          .then(function (result){
            // not found
            assert(!result);
            done();
          }).catch(done);
        });
      }).catch(done);
    });

    it ('post /conference/:conferenceId/admin/cfregistrationtype/:id/delete should return badRequest id try to delete one registrationtype with registrations', function (done) {
      var cfrt = cfregistrationtypeStub(salvedConference.id);
      we.db.models.cfregistrationtype.create(cfrt)
      .then(function (r) {
        assert(r.id);
        // self register
        authenticatedRequest
        .post('/conference/'+salvedConference.id+'/register')
        .send({
          cfregistrationtypeId: r.id
        }).set('Accept', 'application/json')
        .expect(201)
        .end(function (err){
          if (err) throw(err);

          authenticatedRequest
          .post('/conference/'+salvedConference.id+'/admin/cfregistrationtype/'+r.id+'/delete')
          .set('Accept', 'application/json')
          .expect(400)
          .end(function (err, res) {
            if (err) throw err;

            assert.equal(res.body.messages[0].status, 'warning');
            assert.equal(
              res.body.messages[0].message,
              'cfregistrationtype.delete.have.registrations'
            );

            // check if this registration type is deleted
            we.db.models.cfregistrationtype.findById(r.id)
            .then(function (result){
              // not deleted
              assert(result);
              assert(result.id, r.id);
              done();
            }).catch(done);
          });

        });

      }).catch(done);
    });

  });
});