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
    it ('post /conference/create should return 400 with invalid data', function (done) {
      var cf = stubs.conferenceStub();
      cf.email = null;
      authenticatedRequest.post('/conference/create')
      .send({})
      .expect(400)
      .end(function (err, res) {
        if (err) throw err;
        // todo , do more tests
        done();
      });
    });
  });

  describe('conferenceCRUD', function() {
    // it ('post /conference should create one conference with unpublished status and generate default conference structure', function (done) {
    //   var cf = stubs.conferenceStub();
    //   authenticatedRequest.post('/conference')
    //   .send(cf)
    //   .set('Accept', 'application/json')
    //   .expect(201)
    //   .end(function (err, res) {
    //     if (err) throw err;
    //     assert(res.body.conference);
    //     assert(res.body.conference[0]);
    //     assert(res.body.conference[0].id);
    //     assert.equal(res.body.conference[0].title, cf.title);
    //     done();
    //   });
    // });
    it ('post /conference/create should create one conference with unpublished status and generate default conference structure', function (done) {
      var cf = stubs.conferenceStub();
      authenticatedRequest.post('/conference/create')
      .send(cf)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        assert(res.body.conference);
        assert(res.body.conference[0]);
        assert(res.body.conference[0].id);
        assert.equal(res.body.conference[0].title, cf.title);

        we.db.models.cfmenu.findAll({
          where: { conferenceId: res.body.conference[0].id }
        }).then(function (m) {
          // should create more than one menu
          assert(m.length > 0);
          done();
        });
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
    it ('delete /conference/:id should delete one conference and delete related models');
  });

  describe('conferencePageCRUD', function() {
    var SC;
    before(function (done) {
      var cf = stubs.conferenceStub();
      we.db.models.conference.create(cf).then(function (scf) {
        SC = scf;
        done();
      });
    });

    it ('post /conference/:conferenceId/page/create should create one page inside the conference and return JSON', function (done) {
      var pageStub = stubs.pageStub();
      authenticatedRequest.post('/conference/'+SC.id+'/admin/page/create')
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

    it ('post /conference/:conferenceId/page/create should create one page inside the conference and redirect', function (done) {
      var pageStub = stubs.pageStub();
      authenticatedRequest.post('/conference/'+SC.id+'/admin/page/create')
      .send(pageStub)
      .expect(302)
      .end(function (err, res) {
        console.log(res.text)
        if (err) throw err;

        assert(res.text.indexOf(
          'Moved Temporarily. Redirecting to /conference/'+SC.id+'/page/') >-1
        );
        done();
      });
    });
  });

  // describe('roomCRUD', function() {
  //   var SC;
  //   before(function (done) {
  //     var cf = stubs.conferenceStub();
  //     we.db.models.conference.create(cf).then(function (scf) {
  //       SC = scf;
  //       done();
  //     });
  //   });

  //   it ('post /conference/:conferenceId/room should create one room inside the conference', function (done) {
  //     var cfroomStub = stubs.cfroomStub();
  //     authenticatedRequest.post('/conference/'+SC.id+'/room')
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
  //   it ('get /conference/:conferenceId/room/:id should get one conference room', function (done) {
  //     var cfroom = stubs.cfroomStub();
  //     cfroom.conferenceId = SC.id;
  //     we.db.models.cfroom.create(cfroom).then(function (r) {
  //       authenticatedRequest.get('/conference/'+SC.id+'/room/'+r.id)
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
  //   it ('get /conference/:conferenceId/room should get conference room list', function (done) {
  //     var cfs = [
  //       stubs.cfroomStub(), stubs.cfroomStub(), stubs.cfroomStub()
  //     ];

  //     for (var i = cfs.length - 1; i >= 0; i--) {
  //       cfs[i].conferenceId = SC.id;
  //     }

  //     we.db.models.cfroom.bulkCreate(cfs).then(function () {
  //       request(http)
  //       .get('/conference/'+SC.id+'/room')
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
  //   it ('put /conference/:conferenceId/room/:id should update one conference', function (done) {
  //     var cf = stubs.cfroomStub();
  //     cf.conferenceId = SC.id;
  //     we.db.models.cfroom.create(cf).then(function (r) {
  //       var newCfData = {
  //         name: 'updated title :)',
  //         about: 'Mussum ipsum cacilds, vidis litro abertis. Consetis adipiscings elitis.',
  //       };
  //       authenticatedRequest.put('/conference/'+SC.id+'/room/'+r.id)
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
  //   it ('delete /conference/:conferenceId/room/:id should delete one conference', function (done) {
  //     var cf = stubs.conferenceStub();
  //     cf.conferenceId = SC.id;
  //     we.db.models.cfroom.create(cf).then(function (r) {
  //       authenticatedRequest.delete('/conference/'+SC.id+'/room/'+r.id)
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
  //   it ('delete /conference/:conferenceId/room/:id should delete one room and remove sessions from this room');
  // });
});