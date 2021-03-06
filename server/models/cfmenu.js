/**
 * Conferece menu model
 *
 * @module      :: Model
 * @description :: Store event menu config
 */

module.exports = function CfMenuModel(we) {
  const model = {
    definition: {
      /**
       * event Id
       */
      eventId: { type:  we.db.Sequelize.BIGINT, formFieldType: null },
      name: { type:  we.db.Sequelize.STRING },
      class: { type:  we.db.Sequelize.STRING }
    },
    associations: {
      links: {
        type: 'hasMany',
        model: 'cflink'
      }
    },
    options: {
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
            where: { id: res.locals.id }
          })
          .then(function (record) {
            res.locals.data = record;
            if (record) {
              // in other event
              if (req.params.eventId) {
                if (req.params.eventId != record.eventId) {
                  return res.notFound();
                }
              }

              if( record.dataValues.creatorId && req.isAuthenticated()) {
                // ser role owner
                if (req.user.id == record.dataValues.creatorId)
                  if(req.userRoleNames.indexOf('owner') == -1 ) req.userRoleNames.push('owner');
              }

              record.getLinks({
                order: [
                  ['weight','ASC'],
                  ['createdAt','ASC']
                ]
              })
              .then(function(links) {
                record.links = links ;
                done();
                return null;
              })
              .catch(res.queryError);
            } else {
              done();
              return null;
            }
          })
          .catch(res.queryError);
        },
        // disable urlAlias
        urlAlias: false

      },

      instanceMethods: {
        getUrlPath() {
          return we.router.urlTo(
            'cfmenu.findOne', [this.eventId, this.id]
          );
        }
      }
    }
  }
  return model;
};