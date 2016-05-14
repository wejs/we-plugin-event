var assert = require('assert');
var request = require('supertest');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var http;
var we;
var agent;

describe('eventFeature', function() {
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

  describe('eventCRUD', function() {
    it ('post /event/create should return 400 with invalid data', function (done) {
      var cf = stubs.eventStub();
      cf.email = null;
      authenticatedRequest.post('/event/create')
      .send({})
      .set('Accept', 'application/json')
      .expect(400)
      .end(function (err) {
        if (err) throw err;
        // todo , do more tests
        done();
      });
    });
  });

  describe('eventCRUD', function() {
    // it ('post /event should create one event with unpublished status and generate default event structure', function (done) {
    //   var cf = stubs.eventStub();
    //   authenticatedRequest.post('/event')
    //   .send(cf)
    //   .set('Accept', 'application/json')
    //   .expect(201)
    //   .end(function (err, res) {
    //     if (err) throw err;
    //     assert(res.body.event);
    //     assert(res.body.event[0]);
    //     assert(res.body.event[0].id);
    //     assert.equal(res.body.event[0].title, cf.title);
    //     done();
    //   });
    // });
    it ('post /event/create should create one event with unpublished status and generate default event structure', function (done) {
      var cf = stubs.eventStub();
      authenticatedRequest.post('/event/create')
      .send(cf)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        assert(res.body.event);
        assert(res.body.event.id);
        assert.equal(res.body.event.title, cf.title);

        done();
      });
    });
    it ('get /event/:id should get one event', function (done) {
      var cf = stubs.eventStub();
      we.db.models.event.create(cf).then(function (scf) {
        authenticatedRequest.get('/event/'+ scf.id)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(res.body.event);
          assert.equal(res.body.event.id, scf.id);
          assert.equal(res.body.event.title, cf.title);
          done();
        });
      });
    });
    it ('get /event should get event list', function (done) {
      var cfs = [
        stubs.eventStub(), stubs.eventStub(), stubs.eventStub()
      ];
      // publish the events
      cfs.forEach(function (e){
        e.published = true;
      });

      we.db.models.event.bulkCreate(cfs).then(function () {
        request(http)
        .get('/event')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(res.body.event);
          assert(res.body.event.length >= 3);

          done();
        });
      });
    });

    it ('get /event/:id/edit should get event edit form');
    it ('post /event/:id/edit should update one event');

    it ('post /event/:id/delete should delete one event and related models'
    //   , function (done) {
    //   var cf = stubs.eventStub();
    //   we.db.models.event.create(cf).then(function (scf) {
    //     we.db.models.cfpage.create({
    //       eventId: scf.id,
    //       title: 'A example page',
    //       body: 'something awsome',
    //       creatorId: salvedUser.id
    //     }).then(function (page){
    //       authenticatedRequest.post('/event/'+ scf.id+'/delete')
    //       .set('Accept', 'application/json')
    //       .expect(204)
    //       .end(function (err, res) {
    //         if (err) throw err;
    //         assert(!res.body.event);
    //         we.db.models.event.findById(scf.id).then(function (scf) {
    //           assert( we.utils._.isEmpty(scf) );
    //           we.db.models.cfpage.findById(page.id).then(function(p){
    //             assert(!p);
    //             done();
    //           }).catch(done);
    //         }).catch(done);
    //       });
    //     }).catch(done);
    //   });
    // }
    );
  });

  it ('post /event/:eventId([0-9]+)/subscribe-in-session return a warning'+
    ' and dont addSubscriber if session dont have vacancy');
  it ('delete /event/:eventId/room/:id should delete one room and remove sessions from this room');
});