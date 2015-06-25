/**
 * Conference registration
 *
 * @module      :: Model
 * @description :: System conference registration model
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      userId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: null
      },
      conferenceId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: null
      },

      conferenceTypeId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: 'cf-type-selector'
      },

      creatificationName: {
        type: we.db.Sequelize.STRING,
        allowNull: false,
        validation: {
          isNull: false
        }
      },

      userEmail: {
        type: we.db.Sequelize.STRING,
        formFieldType: 'email',
        allowNull: false,
        validation: {
          isEmail: true
        }
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
      }
    },
    associations: {},
    options: {
      classMethods: {},
      instanceMethods: {},
      // TODO check if user is already registered in conference
      hooks: {}
    }
  }

  return model;
}