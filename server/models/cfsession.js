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
      conferenceId: {
        type: we.db.Sequelize.BIGINT, allowNull: false, formFieldType: null
      },

      roomId: { type: we.db.Sequelize.BIGINT, formFieldType: 'cfroom' },

      title: { type:  we.db.Sequelize.STRING(1200) },
      about: { type: we.db.Sequelize.TEXT, formFieldType: 'html' },

      startDate: { type: we.db.Sequelize.DATE },
      endDate: { type: we.db.Sequelize.DATE },

      // confirmed || canceled
      status: {
        type: we.db.Sequelize.STRING,
        defaultValue: 'confirmed'
      }
    },
    associations: {
      user: { type: 'belongsTo', model: 'user' }
    },
    options: {
      titleField: 'title',
      classMethods: {},
      instanceMethods: {},
      hooks: {}
    }
  }

  return model;
}