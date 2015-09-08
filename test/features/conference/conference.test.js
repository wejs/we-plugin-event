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
      .end(function (err, res) {
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
        assert(res.body.event[0]);
        assert(res.body.event[0].id);
        assert.equal(res.body.event[0].title, cf.title);

        we.db.models.cfmenu.findAll({
          where: { eventId: res.body.event[0].id }
        }).then(function (m) {
          // should create more than one menu
          assert(m.length > 0);
          done();
        });
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
          assert(res.body.event[0]);
          assert.equal(res.body.event[0].id, scf.id);
          assert.equal(res.body.event[0].title, cf.title);
          done();
        });
      });
    });
    it ('get /event should get event list', function (done) {
      var cfs = [
        stubs.eventStub(), stubs.eventStub(), stubs.eventStub()
      ];

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

    it ('post /event/:id/delete should delete one event', function (done) {
      var cf = stubs.eventStub();
      we.db.models.event.create(cf).then(function (scf) {

        authenticatedRequest.post('/event/'+ scf.id+'/delete')
        .set('Accept', 'application/json')
        .expect(204)
        .end(function (err, res) {
          if (err) throw err;
          assert(!res.body.event);
          we.db.models.event.findById(scf.id).then(function (scf) {
            assert( we.utils._.isEmpty(scf) );
            done();
          });
        });
      });
    });
    it ('delete /event/:id should delete one event and delete related models');
  });

  describe('eventPageCRUD', function() {
    var SC;
    before(function (done) {
      var cf = stubs.eventStub();
      we.db.models.event.create(cf).then(function (scf) {
        SC = scf;
        done();
      });
    });

    it ('post /event/:eventId/cfpage/create should create one page inside the event and return JSON',
    function (done) {
      var pageStub = stubs.pageStub();
      authenticatedRequest.post('/event/'+SC.id+'/cfpage/create')
      .send(pageStub)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        assert(res.body.cfpage);
        assert(res.body.cfpage[0]);
        assert(res.body.cfpage[0].id);
        assert.equal(res.body.cfpage[0].title, pageStub.title);
        done();
      });
    });
  });

  it ('post /event/:eventId([0-9]+)/subscribe-in-session return a warning'+
    ' and dont addSubscriber if session dont have vacancy');

  // describe('roomCRUD', function() {
  //   var SC;
  //   before(function (done) {
  //     var cf = stubs.eventStub();
  //     we.db.models.event.create(cf).then(function (scf) {
  //       SC = scf;
  //       done();
  //     });
  //   });

  //   it ('post /event/:eventId/room should create one room inside the event', function (done) {
  //     var cfroomStub = stubs.cfroomStub();
  //     authenticatedRequest.post('/event/'+SC.id+'/room')
  //     .send(cfroomStub)
  //     .set('Accept', 'application/json')
  //     .expect(201)
  //     .end(function (err, res) {
  //       if (err) throw err;
  //       assert(res.body.cfroom);
  //       assert(res.body.cfroom[0]);
  //       assert(res.body.cfroom[0].id);
  //       assert.equal(res.body.cfroom[0].name, cfroomStub.name);
  //       done();
  //     });
  //   });
  //   it ('get /event/:eventId/room/:id should get one event room', function (done) {
  //     var cfroom = stubs.cfroomStub();
  //     cfroom.eventId = SC.id;
  //     we.db.models.cfroom.create(cfroom).then(function (r) {
  //       authenticatedRequest.get('/event/'+SC.id+'/room/'+r.id)
  //       .set('Accept', 'application/json')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) throw err;
  //         assert(res.body.cfroom);
  //         assert(res.body.cfroom[0]);
  //         assert.equal(res.body.cfroom[0].id, r.id);
  //         assert.equal(res.body.cfroom[0].name, r.name);
  //         done();
  //       });
  //     });
  //   });
  //   it ('get /event/:eventId/room should get event room list', function (done) {
  //     var cfs = [
  //       stubs.cfroomStub(), stubs.cfroomStub(), stubs.cfroomStub()
  //     ];

  //     for (var i = cfs.length - 1; i >= 0; i--) {
  //       cfs[i].eventId = SC.id;
  //     }

  //     we.db.models.cfroom.bulkCreate(cfs).then(function () {
  //       request(http)
  //       .get('/event/'+SC.id+'/room')
  //       .set('Accept', 'application/json')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) throw err;
  //         assert(res.body.cfroom);
  //         assert(res.body.cfroom.length >= 3);
  //         done();
  //       });
  //     });
  //   });
  //   it ('put /event/:eventId/room/:id should update one event', function (done) {
  //     var cf = stubs.cfroomStub();
  //     cf.eventId = SC.id;
  //     we.db.models.cfroom.create(cf).then(function (r) {
  //       var newCfData = {
  //         name: 'updated title :)',
  //         about: 'Mussum ipsum cacilds, vidis litro abertis. Consetis adipiscings elitis.',
  //       };
  //       authenticatedRequest.put('/event/'+SC.id+'/room/'+r.id)
  //       .send(newCfData)
  //       .set('Accept', 'application/json')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) throw err;
  //         assert(res.body.cfroom);
  //         assert(res.body.cfroom[0]);
  //         assert.equal(res.body.cfroom[0].id, r.id);
  //         assert.equal(res.body.cfroom[0].name, newCfData.name);
  //         assert.equal(res.body.cfroom[0].about, newCfData.about);
  //         assert(res.body.cfroom[0].name || r.name);
  //         assert(res.body.cfroom[0].about || r.about);
  //         done();
  //       });
  //     });
  //   });
  //   it ('delete /event/:eventId/room/:id should delete one event', function (done) {
  //     var cf = stubs.eventStub();
  //     cf.eventId = SC.id;
  //     we.db.models.cfroom.create(cf).then(function (r) {
  //       authenticatedRequest.delete('/event/'+SC.id+'/room/'+r.id)
  //       .set('Accept', 'application/json')
  //       .expect(204)
  //       .end(function (err, res) {
  //         if (err) throw err;
  //         assert(!res.body.cfroom);
  //         we.db.models.cfroom.findById(r.id).then(function (r) {
  //           assert( _.isEmpty(r) );
  //           done();
  //         });
  //       });
  //     });
  //   });
  //
  // });
  it ('delete /event/:eventId/room/:id should delete one room and remove sessions from this room');
});