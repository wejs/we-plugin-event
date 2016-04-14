/**
 * Conference registration
 *
 * @module      :: Model
 * @description :: System event registration model
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      eventId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: null
      },

      userId: {
        type: we.db.Sequelize.INTEGER,
        formFieldType: null,
        validate: {
          isRegistered: function(uid, done) {
            var eventId = this.getDataValue('eventId');
            if (!eventId) return done();
            if (!uid || !Number(uid) ) return done('user.not-found');

            we.db.models.cfregistration.findOne({
              where: {
                eventId: eventId,
                userId: uid
              },
              attributes: ['id']
            }).then(function (count) {
              if (count) {
                return done('event.cfregistration.already.registered');
              }
              done();
            }).catch(done);
          }
        }
      },
      cfregistrationtypeId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: 'cf-type-selector'
      },
      specialRequirements: {
        type: we.db.Sequelize.TEXT,
        formFieldType: null,
        allowNull: true
      },
      // requested, registered
      status: {
        type: we.db.Sequelize.STRING,
        defaultValue: 'requested',
        formFieldType: null
      },
      present: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: false,
        formFieldType: null
      }
    },
    associations: {
      user: {
        type: 'belongsTo',
        model: 'user'
      },
      sessions: {
        type: 'belongsToMany',
        through: 'cfsessionSubscriber',
        model: 'cfsession'
      }
    },
    options: {
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

          return this.find({
            where: { id: res.locals.id },
            include: [{ all: true }]
          }).then(function (record) {
            res.locals.data = record;

            // in other event
            if (record && req.params.eventId) {
              if (req.params.eventId != record.eventId) {
                return res.notFound();
              }
            }

            if (record && record.dataValues.creatorId && req.isAuthenticated()) {
              // ser role owner
              if (record.isOwner(req.user.id)) {
                if(req.userRoleNames.indexOf('owner') == -1 ) req.userRoleNames.push('owner');
              }
            }

            return done();
          });
        }
      },
      instanceMethods: {
        toJSON: function toJSON() {
          var obj = this.get();
          delete obj.deletedAt;
          return obj;
        },
        getUrlPath: function getUrlPath() {
          return we.router.urlTo(
            'cfregistration.findOne', [this.eventId, this.id]
          );
        }
      }
    }
  }

  return model;
}