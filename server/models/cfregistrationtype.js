/**
 * Resgistration type
 *
 * @module      :: Model
 * @description :: Conference system registration type model
 *
 */

module.exports = function Model(we) {
  var model = {
    definition: {
      name: {
        type: we.db.Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },
      conferenceId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: null
      },
      requireValidation: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: false
      }
    },
    associations: {},
    options: {
      titleField: 'name',
      classMethods: {},
      instanceMethods: {},
      // TODO check if user is already registered in conference
      hooks: {}
    }
  }

  return model;
}