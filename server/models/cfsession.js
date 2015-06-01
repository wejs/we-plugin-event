/**
 * Conference session
 *
 * @module      :: Model
 * @description :: System conference session model
 *
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      conferenceId: { type: we.db.Sequelize.BIGINT, allowNull: false },
      roomId: { type: we.db.Sequelize.TEXT },

      logo: { type: we.db.Sequelize.BIGINT },

      title: { type:  we.db.Sequelize.STRING(1200) },
      about: { type: we.db.Sequelize.TEXT },

      startDate: { type: we.db.Sequelize.DATE },
      endDate: { type: we.db.Sequelize.DATE },

      // confirmed || canceled
      status: {
        type: we.db.Sequelize.STRING,
        defaultValue: 'confirmed'
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