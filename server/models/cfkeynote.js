/**
 * Conference keynotes
 *
 * @module      :: Model
 * @description :: System conference keynote model
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

      about: {
        type: we.db.Sequelize.TEXT
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