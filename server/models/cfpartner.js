/**
 * Conferece partner model
 *
 * @module      :: Model
 * @description :: Store event patner data
 */
module.exports = function CfPartnerModel(we) {
  const model = {
    definition: {
      eventId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: null
      },
      name: { type:  we.db.Sequelize.STRING },
      link: { type:  we.db.Sequelize.STRING(1500) },
      weight: { type:  we.db.Sequelize.INTEGER }
    },
    options: {
      titleField: 'name',
      imageFields: {
        logo: { formFieldMultiple: false }
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
            'cfpartner.findOne', [this.eventId, this.id]
          );
        }
      }
    }
  }
  return model;
};