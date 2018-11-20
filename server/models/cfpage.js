/**
 * CF Page Model
 *
 * @module      :: Model
 * @description :: cfpage model
 *
 */

module.exports = function CfPageModel(we) {
  // set sequelize model define and options
  const model = {
    definition: {
      creatorId: { type: we.db.Sequelize.BIGINT, formFieldType: null },

      title: { type: we.db.Sequelize.STRING(1500) },
      body: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },

      published: { type: we.db.Sequelize.BOOLEAN, defaultValue: false, formFieldType: 'boolean' }
    },
    associations: {
      event: { type: 'belongsTo', model: 'event' }
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
            where: { id: res.locals.id },
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
          });
        }
      },
      instanceMethods: {
        getUrlPath() {
          return we.router.urlTo(
            'cfpage.findOne', [this.eventId, this.id]
          );
        }
      },
      hooks: {
        afterDestroy(record) {
          // delete related cflinks
          if (!record || !record.eventId || !record.id) {return record;
          }

          return we.db.models.cflink.destroy({
            where: {
              href: we.router.urlTo('cfpage.findOne', [record.eventId, record.id])
            }
          })
          .then( function() {
            return record;
          })
          .catch(function(err) {
            we.log.error('Error on destroy cfpage links:', err);
            return record;
          });
        }
      }
    }
  }

  return model;
}