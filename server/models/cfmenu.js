/**
 * Conferece menu model
 *
 * @module      :: Model
 * @description :: Store conference menu config
 */

module.exports = function Model(we) {
  var model = {
    definition: {
      /**
       * conference Id
       */
      conferenceId: { type:  we.db.Sequelize.BIGINT, formFieldType: null },
      name: { type:  we.db.Sequelize.STRING },
      class: { type:  we.db.Sequelize.STRING }
    },
    associations: {
      links: {
        type: 'hasMany',
        model: 'cflink'
      }
    },
  }
  return model;
};