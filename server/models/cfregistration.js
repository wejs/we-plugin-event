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
        validate: {
          isRegistered: function(uid, done) {
            var eventId = this.getDataValue('eventId');
            if (!eventId) return done();
            if (!uid || !Number(uid) )
              return done('user.not-found');

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
      classMethods: {},
      instanceMethods: {
        toJSON: function toJSON() {
          var obj = this.get();
          delete obj.deletedAt;
          return obj;
        }
      }
    }
  }

  return model;
}