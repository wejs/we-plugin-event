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

      about: { type: we.db.Sequelize.TEXT },
      body: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },

      active: { type: we.db.Sequelize.BOOLEAN, defaultValue: true, formFieldType: null },
      published: { type: we.db.Sequelize.BOOLEAN, defaultValue: false, formFieldType: 'boolean' },

      // body without tags
      bodyClean: { type: we.db.Sequelize.TEXT, formFieldType: null },
      // body small body text version or description
      bodyTeaser: { type: we.db.Sequelize.TEXT, formFieldType: null },
      featuredImageId: { type: we.db.Sequelize.BIGINT, formFieldType: null },

      conferenceId: { type: we.db.Sequelize.BIGINT, formFieldType: null }
    },
    associations: {
      creator: {
        type: 'belongsTo',
        model : 'user',
        constraints: false
      }
    },
    options: {
      termFields: {
        tags: {
          vocabularyId: null,
          canCreate: true
        },
        categories: {
          vocabularyId: 1,
          canCreate: false
        }
      },

      classMethods: {},
      instanceMethods: {},
      hooks: {}
    }
  }

  return model;
}