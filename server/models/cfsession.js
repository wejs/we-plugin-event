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

      title: { type:  we.db.Sequelize.STRING(1200) },
      about: { type: we.db.Sequelize.TEXT, formFieldType: 'html', formFieldHeight: 200 },

      startDate: { type: we.db.Sequelize.DATE },
      endDate: { type: we.db.Sequelize.DATE },

      roomIdSelector: { type: we.db.Sequelize.VIRTUAL, formFieldType: 'cfroom-selector' },

      requireRegistration: {
        type: we.db.Sequelize.BOOLEAN, defaultValue: false
      }
    },
    associations: {
      room: { type: 'belongsTo', model: 'cfroom' },
      user: { type: 'belongsTo', model: 'user' }
    },
    options: {
      titleField: 'title',
      classMethods: {},
      instanceMethods: {},
      hooks: {},
      imageFields: {
        picture: { formFieldMultiple: false }
      },

    }
  }

  return model;
}