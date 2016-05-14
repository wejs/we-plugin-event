/**
 * Conference
 *
 * @module      :: Model
 * @description :: System event model
 *
 */

module.exports = function Model(we) {
  var model = {
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
      country: {
        type: we.db.Sequelize.STRING,
        formFieldType: null
      },
      state: {
        type: we.db.Sequelize.STRING,
        formFieldType: null
      },
      city: {
        type: we.db.Sequelize.STRING,
        formFieldType: null
      },
      latitude: {
        type: we.db.Sequelize.DECIMAL(18,15)
      },
      longitude: {
        type: we.db.Sequelize.DECIMAL(18,15)
      },
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
      // in conference mode, this event only allows single user registrations
      conferenceMode: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: false,
        formFieldType: 'boolean'
      },
      managerIds: {
        type: we.db.Sequelize.VIRTUAL,
        formFieldType: null,
        get: function() {
          var ms = this.getDataValue('managers');
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
        get: function() {
          var startDate = this.getDataValue('registrationStartDate');
          var endDate = this.getDataValue('registrationEndDate');

          if (startDate) startDate = we.utils.moment(startDate).unix();
          if (endDate) endDate = we.utils.moment(endDate).unix();
          var now = we.utils.moment().unix();

          // before registration
          if (startDate && (now < startDate) ) return 'closed_before';
          // after registration date
          if (endDate && (now > endDate) ) return 'closed_after';

          if (startDate && endDate) {
            // is open if are between start and end date
            if ((now > startDate) && (now < endDate)) {
              var vac = this.getDataValue('vacancies');

              if (vac && (vac <= this.getDataValue('registrationCount')) ) {
                return 'closed_no_vacancies';
              }
              return 'open';
            }
          }

          return 'closed';
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
        contextLoader: function contextLoader(req, res, done) {
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
          return this.find({
            where: { id: res.locals.id},
            include: [{ all: true }]
          }).then(function (record) {
            res.locals.data = record;
            if (record && record.dataValues.creatorId && req.isAuthenticated()) {
              // ser role owner
              if (record.isOwner(req.user.id)) {
                if(req.userRoleNames.indexOf('owner') == -1 ) req.userRoleNames.push('owner');
              }
            }

            return done();
          })
        },
        // returns an url alias
        urlAlias: function urlAlias(record) {
          if (!record.abbreviation) return null;
          return {
            alias: '/e/'+we.utils.string( record.abbreviation ).slugify().s,
            target: '/event/' + record.id,
          }
        }
      },
      instanceMethods: {
        isManager: function isManager(userId, cb) {
          var ms = this.managerIds;
          var isMNG = false;
          if (ms.indexOf(userId) > -1) isMNG = true;
          cb(null, isMNG);
        }
      },
      hooks: {
        afterCreate: function afterCreate (record, options, cb) {
          we.utils.async.series([
            function addCreatorAsManager (done){
              record.addManager(record.creatorId)
              .then(function afterAddCreatorAsManager (){
                done();
              }).catch(done);
            }
          ], function (err) {
            cb(err, record);
          });
        }
      }
    }
  }

  return model;
}