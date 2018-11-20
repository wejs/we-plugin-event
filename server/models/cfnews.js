/**
 * CF News Model
 *
 * @module      :: Model
 * @description :: cfnews model
 *
 */

module.exports = function CfNewsModel(we) {
	const model = {
		definition: {
			creatorId: {
				type: we.db.Sequelize.BIGINT, formFieldType: null
			},
      eventId: { type: we.db.Sequelize.BIGINT, formFieldType: null },

			title: {
				type: we.db.Sequelize.STRING, allowNull: false
			},
      teaser: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 200
      },
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

      titleField: 'title',

      classMethods: {
        /**
         * Context loader, preload current request record and related data
         *
         * @param  {Object}   req  express.js request
         * @param  {Object}   res  express.js response
         * @param  {Function} done callback
         */
        contextLoader(req, res, done) {
          if (!res.locals.id || !res.locals.loadCurrentRecord) return done();

          return this.findOne({
            where: { id: res.locals.id},
            include: [{ all: true }]
          })
          .then(function (record) {
            res.locals.data = record;

            // in other event
            if (record && req.params.eventId) {
              if (req.params.eventId != record.eventId) {
                return res.notFound();
              }
            }

            if (record && record.dataValues.creatorId && req.isAuthenticated()) {
              // ser role owner
              if (record.isOwner(req.user.id)) {
                if(req.userRoleNames.indexOf('owner') == -1 ) req.userRoleNames.push('owner');
              }
            }

            done();
            return null;
          })
        }
      },
      instanceMethods: {
        getUrlPath() {
          return we.router.urlTo(
            'cfnews.findOne', [this.eventId, this.id]
          );
        }
      }
    }
	};

	return model;
}