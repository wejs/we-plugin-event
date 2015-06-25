/**
 * Certification
 *
 * @module      :: Model
 * @description :: System conference certification model
 *
 */

module.exports = function Model(we) {
  var model = {
    definition: {
      text: { type: we.db.Sequelize.TEXT },
      userId: { type: we.db.Sequelize.BIGINT, allowNull: false },
      conferenceId: { type: we.db.Sequelize.BIGINT, allowNull: false },
      sessionId: { type: we.db.Sequelize.BIGINT },

      checked: {
        type: we.db.Sequelize.VIRTUAL, formFieldType: null
      }
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