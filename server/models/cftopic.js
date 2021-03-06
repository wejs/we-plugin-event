/**
 * Conference topic
 *
 * @module      :: Model
 * @description :: System event topic model
 *
 */
module.exports = function CfTopicModel(we) {
  const model = {
    definition: {
      title: { type:  we.db.Sequelize.STRING(1500) },
      about: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },
      weight: { type:  we.db.Sequelize.INTEGER }
    },
    associations: {
      event: { type: 'belongsTo', model: 'event' }
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
      classMethods: {
        /**
         * Context loader, preload current request record and related data
         *
         * @param  {Object}   req  express.js request
         * @param  {Object}   res  express.js response
         * @param  {Function} done callback
         */
        contextLoader(req, res, done) {
          if (res.locals.action == 'find') {
            return this.contextLoaderFindAll(req, res, done);
          }

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
          })
          .catch(done);
        },
        contextLoaderFindAll(req, res, done) {
          if (res.locals.event) {
            req.query.eventId = res.locals.event;
          }

          return done();
        }
      },
      instanceMethods: {
        getUrlPath() {
          return we.router.urlTo(
            'cftopic.findOne', [this.eventId, this.id]
          );
        }
      },
      imageFields: {
        image: { formFieldMultiple: false }
      }
    }
  }

  return model;
}