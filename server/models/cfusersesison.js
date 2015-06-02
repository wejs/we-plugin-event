/**
 * Conference user session association
 *
 * @module      :: Model
 * @description :: System conference user session association model
 *
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      sessionId: { type: we.db.Sequelize.BIGINT, allowNull: false },
      userId: { type: we.db.Sequelize.BIGINT, allowNull: false }
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