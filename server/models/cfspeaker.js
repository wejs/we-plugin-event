/**
 * Conference speakers
 *
 * @module      :: Model
 * @description :: System conference speakers model
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      conferenceId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: null
      },

      name: {
        type: we.db.Sequelize.STRING,
        allowNull: false
      },
      about: { type: we.db.Sequelize.TEXT },
      weight: { type: we.db.Sequelize.INTEGER },
      highlighted: {
        type: we.db.Sequelize.BOOLEAN,
        formFieldType: 'boolean',
        defaultsTo: false
      }
    },
    options: {
      imageFields: {
        picture: { formFieldMultiple: false }
      },
      titleField: 'name'
    }
  }

  return model;
}