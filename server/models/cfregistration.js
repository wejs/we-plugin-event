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