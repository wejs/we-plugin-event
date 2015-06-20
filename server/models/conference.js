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
      creatorId: { type: we.db.Sequelize.BIGINT, formFieldType: null },
      title: { type: we.db.Sequelize.STRING(1500), allowNull: false },
      // unique name used in url
      abbreviation: { type:  we.db.Sequelize.STRING, unique: true },
      about: { type: we.db.Sequelize.TEXT },
      email: {
        type: we.db.Sequelize.STRING(1500),
        validate: { isEmail: true }
      },
      // conference dates
      callForPapersStartDate: { type: we.db.Sequelize.DATE },
      callForPapersEndDate: { type: we.db.Sequelize.DATE },
      registrationStartDate: { type: we.db.Sequelize.DATE },
      registrationEndDate: { type: we.db.Sequelize.DATE },
      eventStartDate: { type: we.db.Sequelize.DATE },
      eventEndDate: { type: we.db.Sequelize.DATE },

      logo: { type: we.db.Sequelize.BIGINT, formFieldType: null },
      banner: { type: we.db.Sequelize.BIGINT, formFieldType: null },

      registrationManagerName: { type: we.db.Sequelize.TEXT },
      registrationManagerEmail: {
        type: we.db.Sequelize.STRING(1200),
        validate: { isEmail: true }
      },

      location: { type: we.db.Sequelize.TEXT },

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