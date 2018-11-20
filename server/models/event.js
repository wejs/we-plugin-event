/**
 * Conference
 *
 * @module      :: Model
 * @description :: System event model
 *
 */
const assocModelsToDelete = [
  'cfcontact', 'cflink', 'cfmenu',
  'cfnews', 'cfpage', 'cfpartner',
  'cfregistration', 'cfregistrationtype', 'cfroom',
  'cfsession', 'cfspeaker', 'cftopic',
  'cfvideo'
];

module.exports = function Model(we) {
  const model = {
    definition: {
      creatorId: { type: we.db.Sequelize.BIGINT, formFieldType: null },
      title: { type: we.db.Sequelize.STRING(1500), allowNull: false },
      // unique name used in url
      abbreviation: {
        type:  we.db.Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      about: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },
      email: {
        type: we.db.Sequelize.STRING(1500),
        validate: { isEmail: true }
      },
      // event dates
      callForPapersStartDate: { type: we.db.Sequelize.DATE },
      callForPapersEndDate: { type: we.db.Sequelize.DATE },
      registrationStartDate: { type: we.db.Sequelize.DATE },
      registrationEndDate: { type: we.db.Sequelize.DATE },
      eventStartDate: { type: we.db.Sequelize.DATE },
      eventEndDate: { type: we.db.Sequelize.DATE },

      registrationManagerName: { type: we.db.Sequelize.TEXT },
      registrationManagerEmail: {
        type: we.db.Sequelize.STRING(1200),
        validate: { isEmail: true }
      },

      vacancies: {
        type: we.db.Sequelize.INTEGER,
        formFieldType: 'number'
      },
      registrationCount: {
        type: we.db.Sequelize.VIRTUAL,
        formFieldType: null
      },
      workload: {
        type: we.db.Sequelize.INTEGER,
        formFieldType: 'number'
      },
      isOnline: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: false,
        formFieldType: 'boolean'
      },
      location: { type: we.db.Sequelize.TEXT },
      published: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: false,
        formFieldType: 'boolean'
      },
      registrationEmail: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },
      registrationWaitingAccept: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },
      registeredText: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },
      managerIds: {
        type: we.db.Sequelize.VIRTUAL,
        formFieldType: null,
        get() {
          let ms = this.getDataValue('managers');
          if (!ms) return [];
          return ms.map(function (m) {
            if (typeof m == 'object') {
              return m.id;
            }  else {
              return m;
            }
          });
        }
      },
      /**
       * registration status
       *
       * return closed, closed_before, open, closed_no_vacancies or closed_after
       *
       * @type {Object}
       */
      registrationStatus: {
        type: we.db.Sequelize.VIRTUAL,
        formFieldType: null,
        get() {
          let startDate = this.getDataValue('registrationStartDate');
          let endDate = this.getDataValue('registrationEndDate');

          if (startDate) startDate = we.utils.moment(startDate).unix();
          if (endDate) endDate = we.utils.moment(endDate).unix();
          let now = we.utils.moment().unix();

          // before registration
          if (startDate && (now < startDate) ) return 'closed_before';
          // after registration date
          if (endDate && (now > endDate) ) return 'closed_after';

          if (startDate && endDate) {
            // is open if are between start and end date
            if ((now > startDate) && (now < endDate)) {
              let vac = this.getDataValue('vacancies');

              if (vac && (vac <= this.getDataValue('registrationCount')) ) {
                return 'closed_no_vacancies';
              }
              return 'open';
            }
          }

          return 'closed';
        }
      },
      /**
       * Resolve and return sendWorkStatus based in
       *
       * disabled || after || before || open
       * @type {Object}
       */
      sendWorkStatus: {
        type: we.db.Sequelize.VIRTUAL,
        formFieldType: null,
        get() {
          let s = this.getDataValue('callForPapersStartDate');
          let e = this.getDataValue('callForPapersEndDate');

          if (s) s = we.utils.moment(s).unix();
          if (e) e = we.utils.moment(e).unix();

          if (!s||!e) return 'disabled';

          let now = we.utils.moment().unix();

          if ( (s <= now) && (now<=e) ) {
            return 'open';
          } else if (s > now) {
            return 'before';
          } else {
            return 'after';
          }
        }
      },
      theme: {
        type: we.db.Sequelize.STRING,
        formFieldType: 'cf-theme-selector'
      }
    },
    associations: {
      managers: {
        type: 'belongsToMany',
        through: 'cfmanager',
        model: 'user'
      },
      mainMenu: {
        type: 'belongsTo',
        model: 'cfmenu'
      },
      secondaryMenu: {
        type: 'belongsTo',
        model: 'cfmenu'
      },
      socialMenu: {
        type: 'belongsTo',
        model: 'cfmenu'
      },
      topics: {
        type: 'hasMany',
        model: 'cftopic'
      },
      tagsRecords: {
        type: 'hasMany',
        model: 'modelsterms',
        inverse: 'modelId',
        constraints: false,
        foreignKey: 'modelId',
        scope: {
          modelName: 'event'
        }
      }
    },
    options: {
      titleField: 'title',

      enableAlias: true,

      termFields: {
        tags: {
          vocabularyName: null,
          canCreate: true,
          formFieldMultiple: true,
          onlyLowercase: true
        },
        categories: {
          vocabularyName: 'Category',
          canCreate: false,
          formFieldMultiple: false
        }
      },
      imageFields: {
        logo: { formFieldMultiple: false },
        banner: { formFieldMultiple: false },
        favicon: { formFieldMultiple: false }
      },
      classMethods: {
        /**
         * Context loader, preload current request record and related data
         *
         * @param  {Object}   req  express.js request
         * @param  {Object}   res  express.js response
         * @param  {Function} done callback
         */
        contextLoader(req, res, done) {
          if (!res.locals.id || !res.locals.loadCurrentRecord) return done();
          // if event is already loaded with req.params
          if (res.locals.event) {
            res.locals.data = res.locals.event;
            if (res.locals.data && res.locals.data.dataValues.creatorId && req.isAuthenticated()) {
              // ser role owner
              if (res.locals.data.isOwner(req.user.id)) {
                if(req.userRoleNames.indexOf('owner') == -1 ) req.userRoleNames.push('owner');
              }
            }
            return done();
          }

          // else load the event
          return this.findOne({
            where: { id: res.locals.id},
            include: [{ all: true }]
          })
          .then(function (record) {
            res.locals.data = record;
            if (record && record.dataValues.creatorId && req.isAuthenticated()) {
              // ser role owner
              if (record.isOwner(req.user.id)) {
                if(req.userRoleNames.indexOf('owner') == -1 ) req.userRoleNames.push('owner');
              }
            }

            done();
            return null;
          })
        },
        // returns an url alias
        urlAlias(record) {
          if (!record.abbreviation) return null;
          return {
            alias: '/e/'+we.utils
              .string( record.abbreviation )
              .truncate(40)
              .slugify()
              .s,
            target: '/event/' + record.id,
          }
        }
      },
      instanceMethods: {
        isManager(userId, cb) {
          let ms = this.managerIds;
          let isMNG = false;
          if (ms.indexOf(userId) > -1) isMNG = true;
          cb(null, isMNG);
        },
        generateDefaultMenus(cb) {
          const self = this;

          we.utils.async.series([
            function createMainMenu (done){
              we.db.models.cfmenu.create({
                eventId: self.id,
                name:  'main',
                class: 'nav navbar-nav navbar-right'
              })
              .then(function afterCreateCFMenus(m) {
                self.setMainMenu(m);
                return we.db.models.cflink.bulkCreate([{
                  eventId: self.id,
                  cfmenuId: m.id,
                  text: we.i18n.__('cfnews.find'),
                  title: we.i18n.__('cfnews.find'),
                  href: '/event/'+self.id+'/cfnews',
                  depth: 1
                },{
                  eventId: self.id,
                  cfmenuId: m.id,
                  text: we.i18n.__('cfvideo.find'),
                  title: we.i18n.__('cfvideo.find'),
                  href: '/event/'+self.id+'/cfvideo',
                  depth: 3
                },{
                  eventId: self.id,
                  cfmenuId: m.id,
                  text: we.i18n.__('cfcontact.link'),
                  title: we.i18n.__('cfcontact.link'),
                  href: '/event/'+self.id+'/contact',
                  depth: 5
                }])
                .spread(function afterAddLinksToMainMenu() {
                  done();
                  return null;
                });
              })
              .catch(done);
            },
            function createSecondaryMenu (done){
              we.db.models.cfmenu.create({
                eventId: self.id,
                name: 'secondary',
                class: 'nav nav-pills sidebar-menu nav-stacked'
              })
              .then(function afterCreateSecondaryMenu(m) {
                self.setSecondaryMenu(m);
                done();
                return null;
              })
              .catch(done)
            },
            function createSocialMenu (done){
              we.db.models.cfmenu.create({
                eventId: self.id,
                name: 'social',
                class: 'list-inline join-us'
              })
              .then(function afterCreateSocialMenu(m) {
                self.setSocialMenu(m);

                return we.db.models.cflink.bulkCreate([{
                  eventId: self.id,
                  cfmenuId: m.id,
                  text: '<i class="fa fa-youtube-play"></i> ',
                  href: '#',
                  class: 'btn btn-empty-inverse btn-lg',
                  depth: 1
                },
                {
                  eventId: self.id,
                  cfmenuId: m.id,
                  text: '<i class="fa fa-facebook"></i> ',
                  href: '#',
                  class: 'btn btn-empty-inverse btn-lg',
                  depth: 1
                },
                {
                  eventId: self.id,
                  cfmenuId: m.id,
                  text: '<i class="fa fa-twitter"></i> ',
                  href: '#',
                  class: 'btn btn-empty-inverse btn-lg',
                  depth: 1
                }])
                .then(function afterAddLinksToSocialMenu() {
                  done();
                  return null;
                });
              })
              .catch(done)
            }
          ], cb);
        },
        generateDefaultWidgets(cb) {
          const self = this;

          we.utils.async.series([
            function createEventWidgets(done) {
              we.db.models.widget.bulkCreate([{
                title: we.i18n.__('event.menu.admin'),
                type: 'we-cf-menu-admin',
                layout: 'eventAdmin',
                regionName: 'sidebar',
                context: 'event-' + self.id
              },{
                title: we.i18n.__('event.menu.content'),
                type: 'we-cf-menu-content',
                layout: 'eventAdmin',
                regionName: 'sidebar',
                context: 'event-' + self.id
              },
              {
                title: we.i18n.__('cfnews.find'),
                type: 'we-cf-news',
                layout: 'eventHome',
                regionName: 'afterContent',
                context: 'event-' + self.id
              },
              {
                title: we.i18n.__('event.schedule'),
                type: 'we-cf-schedule',
                layout: 'eventHome',
                regionName: 'afterContent',
                context: 'event-' + self.id
              },
              {
                title: we.i18n.__('cfspeaker.find'),
                type: 'we-cf-speakers',
                layout: 'eventHome',
                regionName: 'afterContent',
                context: 'event-' + self.id
              },
              {
                title: we.i18n.__('cftopic.find'),
                type: 'we-cf-topics',
                layout: 'eventHome',
                regionName: 'afterContent',
                context: 'event-' + self.id
              },
              {
                type: 'we-cf-video',
                layout: 'eventHome',
                regionName: 'afterContent',
                context: 'event-' + self.id
              },
              {
                title: we.i18n.__('cfpartner.find'),
                type: 'we-cf-partners',
                layout: 'eventHome',
                regionName: 'afterContent',
                context: 'event-' + self.id
              },
              {
                title: we.i18n.__('form-event-about-location'),
                type: 'we-cf-location-map',
                layout: 'eventHome',
                regionName: 'afterContent',
                context: 'event-' + self.id
              }
              ])
              .spread(function afterCreateEventWidgets() {
                done();
                return null;
              })
              .catch(done);
            }
          ], cb);
        }
      },
      hooks: {
        afterFind(record) {
          return new Promise( (resolve, reject)=> {

            // load registration count for every event
            let finds = [];
            if (we.utils._.isArray(record) ) {
              record.forEach(function (r){
                finds.push(function (cb) {
                  we.db.models.cfregistration.count({
                    where: {  eventId: r.id }
                  })
                  .then(function (count){
                    r.registrationCount = count;
                    cb();
                    return null;
                  })
                  .catch(cb);
                });
              });
            } else {
              // 0 itens found
              if (!record) return resolve();
              // load cfregistration count for find one record
              finds.push(function (cb) {
                we.db.models.cfregistration
                .count({
                  where: {  eventId: record.id }
                })
                .then(function (count){
                  record.registrationCount = count;
                  cb();
                  return null;
                })
                .catch(cb);
              });
            }
            we.utils.async.series(finds, (err)=> {
              if (err) return reject(err);
              resolve();
            });
          });
        },
        afterCreate(record) {
          return new Promise((resolve, reject)=> {
            we.utils.async.series([
              function addCreatorAsManager (done){
                record.addManager(record.creatorId)
                .then(function afterAddCreatorAsManager (){
                  done();
                  return null;
                })
                .catch(done);
              },
              record.generateDefaultMenus.bind(record),
              record.generateDefaultWidgets.bind(record),
              function createDefaultRegistrationType (done){
                return we.db.models.cfregistrationtype.create({
                  name: we.i18n.__('event.cfregistrationtype.name.default'),
                  eventId: record.id
                })
                .then(function afterCreateOneRegistrationType (){
                  done();
                  return null;
                })
                .catch(done);
              }
            ], function (err) {
              if (err) return reject(err);
              resolve(record);
            });
          });
        },
        afterDestroy(record) {
          return new Promise( (resolve, reject)=> {
            let fns = [];
            assocModelsToDelete.forEach(function (m){
              fns.push(function (done) {
                we.db.models[m].destroy({
                  where: {
                    [we.Op.or]: [
                      { eventId: record.id },
                      { eventId: null }
                    ]
                  }
                })
                .then( ()=> done() )
                .catch(done);
              });
            });
            // after destroy delete all related content
            we.utils.async.series(fns, function (err) {
              if (err) return reject(err);
              resolve(record);
            });
          });
        }
      }
    }
  }

  return model;
}