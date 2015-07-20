/**
 * Conferece patner model
 *
 * @module      :: Model
 * @description :: Store conference patner data
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      conferenceId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: null
      },
      name: { type:  we.db.Sequelize.STRING },
      link: { type:  we.db.Sequelize.STRING(1500) },
      weight: { type:  we.db.Sequelize.INTEGER }
    },
    options: {
      imageFields: {
        logo: { formFieldMultiple: false }
      }
    }
  }
  return model;
};