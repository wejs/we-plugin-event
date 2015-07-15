/**
 * Conferece link model
 *
 * @module      :: Model
 * @description :: Store conference menu link config
 */

module.exports = function Model(we) {
  var model = {
    definition: {
      /**
       * conference Id
       */
      conferenceId: { type:  we.db.Sequelize.BIGINT, formFieldType: null },
      href: { type:  we.db.Sequelize.TEXT, formFieldType: 'text' },

      text: { type:  we.db.Sequelize.TEXT, formFieldType: 'text' },
      title: { type:  we.db.Sequelize.TEXT, formFieldType: 'text' },

      class: { type:  we.db.Sequelize.STRING },
      style: { type:  we.db.Sequelize.STRING },

      target: { type:  we.db.Sequelize.STRING },
      rel: { type:  we.db.Sequelize.STRING },

      key: { type:  we.db.Sequelize.STRING(10) },

      depth: { type:  we.db.Sequelize.INTEGER },
      weight: { type:  we.db.Sequelize.INTEGER },
      parent: { type:  we.db.Sequelize.INTEGER }
    },
    // associations: {
    //   cfmenu: {
    //     type: 'belongsTo',
    //     model: 'cfmenu'
    //   }
    // }
  }
  return model;
};