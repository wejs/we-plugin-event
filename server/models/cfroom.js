/**
 * Conference room
 *
 * @module      :: Model
 * @description :: System conference room model
 *
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      conferenceId: { type: we.db.Sequelize.BIGINT, allowNull: false },
      name: {
        type:  we.db.Sequelize.STRING(1500)
      },
      about: { type: we.db.Sequelize.TEXT }
    },
    associations: {},
    options: {
      classMethods: {},
      instanceMethods: {},
      hooks: {}
    }
  }

  return model;
}