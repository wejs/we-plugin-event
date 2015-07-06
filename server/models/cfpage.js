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

      title: { type: we.db.Sequelize.TEXT },
      body: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },

      active: { type: we.db.Sequelize.BOOLEAN, defaultValue: true, formFieldType: null },
      published: { type: we.db.Sequelize.BOOLEAN, defaultValue: false, formFieldType: 'boolean' },

      conferenceId: { type: we.db.Sequelize.BIGINT, formFieldType: null }
    },
    associations: {},
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

      classMethods: {},
      instanceMethods: {},
      hooks: {}
    }
  }

  return model;
}