/**
 * Conference
 *
 * @module      :: Model
 * @description :: System conference model
 *
 */

module.exports = function Model(we) {
  var model = {
    definition: {
      // unique name used in url
      uniquename: {
        type:  we.db.Sequelize.STRING,
        unique: true
      },
      title: { type: we.db.Sequelize.STRING(1200), allowNull: false },
      about: { type: we.db.Sequelize.TEXT },

      logo: { type: we.db.Sequelize.BIGINT },
      banner: { type: we.db.Sequelize.BIGINT },

      registrationManagerName: { type: we.db.Sequelize.TEXT },
      registrationManagerEmail: {
        type: we.db.Sequelize.STRING(1200),
        validate: { isEmail: true }
      },

      location: { type: we.db.Sequelize.TEXT },

      callForPapersStartDate: { type: we.db.Sequelize.DATE },
      callForPapersEndDate: { type: we.db.Sequelize.DATE },
      registrationStartDate: { type: we.db.Sequelize.DATE },
      registrationEndDate: { type: we.db.Sequelize.DATE },
      eventStartDate: { type: we.db.Sequelize.DATE },
      eventEndDate: { type: we.db.Sequelize.DATE },

      status: {
        type: we.db.Sequelize.STRING,
        defaultValue: 'salved'
      },
    },
    associations: {
      creator: {
        type: 'belongsTo',
        model : 'user',
        constraints: false
      }
    },
    options: {
      classMethods: {},
      instanceMethods: {},
      hooks: {}
    }
  }

  return model;
}