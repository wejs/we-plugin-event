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
      requireValidation: {
        type: we.db.Sequelize.BOOLEAN,
        formFieldType: 'boolean',
        defaultValue: false
      }
    },
    associations: {
      event: {
        type: 'belongsTo',
        model: 'event'
      }
    },
    options: {
      titleField: 'name',
      classMethods: {},
      instanceMethods: {},
      // TODO check if user is already registered in event
      hooks: {}
    }
  }

  return model;
}