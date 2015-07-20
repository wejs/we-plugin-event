/**
 * Conference room
 *
 * @module      :: Model
 * @description :: System conference room model
 *
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      conferenceId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: null
      },
      name: { type: we.db.Sequelize.STRING,allowNull: false },
      about: { type: we.db.Sequelize.TEXT },
      vacancy: { type: we.db.Sequelize.INTEGER }
    },

    options: {
      titleField: 'name',
      termFields: {
        tags: {
          vocabularyName: null,
          canCreate: true,
          formFieldMultiple: true,
          onlyLowercase: true
        },
        categories: {
          vocabularyName: 'Category',
          canCreate: false,
          formFieldMultiple: false
        }
      },
      imageFields: {
        picture: { formFieldMultiple: false }
      }
    }
  };

  return model;
}