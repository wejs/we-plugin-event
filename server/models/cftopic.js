/**
 * Conference topic
 *
 * @module      :: Model
 * @description :: System conference topic model
 *
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      title: { type:  we.db.Sequelize.STRING(1500) },
      about: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },
      weight: { type:  we.db.Sequelize.INTEGER }
    },
    options: {
      titleField: 'title',
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
        image: { formFieldMultiple: false }
      }
    }
  }

  return model;
}