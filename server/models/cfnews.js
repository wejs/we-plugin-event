/**
 * CF Page Model
 *
 * @module      :: Model
 * @description :: cfpage model
 *
 */

module.exports = function Model(we) {
	var model = {
		definition: {
			creatorId: {
				type: we.db.Sequelize.BIGINT, formFieldType: null
			},
      conferenceId: { type: we.db.Sequelize.BIGINT, formFieldType: null },

			title: {
				type: we.db.Sequelize.STRING, allowNull: false
			},
      teaser: { type: we.db.Sequelize.TEXT },
			text: {
				type: we.db.Sequelize.TEXT,
				formFieldType: 'html',
				formFieldHeight: 300
			},
      published: {
        type: we.db.Sequelize.BOOLEAN, defaultValue: true ,
        formFieldType: 'boolean'
      },
      // keep cfnews above in lists
      keepAbove: {
        type: we.db.Sequelize.BOOLEAN, defaultValue: false,
        formFieldType: 'boolean'
      }
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

      classMethods: {},
      instanceMethods: {},
      hooks: {}
    }
	};

	return model;
}