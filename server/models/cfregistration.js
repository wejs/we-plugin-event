/**
 * Conference registration
 *
 * @module      :: Model
 * @description :: System conference registration model
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      userId: { type: we.db.Sequelize.BIGINT, allowNull: false },
      conferenceId: { type: we.db.Sequelize.BIGINT, allowNull: false },

      specialRequirements: { type: we.db.Sequelize.TEXT },

      // requested, registered
      status: {
        type: we.db.Sequelize.STRING,
        defaultValue: 'requested'
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