/**
 * CF Page Model
 *
 * @module      :: Model
 * @description :: cfpage model
 *
 */

module.exports = function Model(we) {
  // set sequelize model define and options
  var model = {
    definition: {
      creatorId: { type: we.db.Sequelize.BIGINT, formFieldType: null },

      title: { type: we.db.Sequelize.STRING(1500) },
      body: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },

      published: { type: we.db.Sequelize.BOOLEAN, defaultValue: false, formFieldType: 'boolean' },

      conferenceId: { type: we.db.Sequelize.BIGINT, formFieldType: null }
    },
    options: {
      imageFields: {
        featuredImage: { formFieldMultiple: false },
        // todo add suport to multiple images
        //galery: { formFieldMultiple: true }
      },
      termFields: {
        categories: {
          vocabularyName: 'Category',
          canCreate: false,
          formFieldMultiple: false
        },
        tags: {
          vocabularyName: null,
          canCreate: true,
          formFieldMultiple: true,
          onlyLowercase: true
        }
      },

      titleField: 'title',

      classMethods: {},
      instanceMethods: {},
      hooks: {}
    }
  }

  return model;
}