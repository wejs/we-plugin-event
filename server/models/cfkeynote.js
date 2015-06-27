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