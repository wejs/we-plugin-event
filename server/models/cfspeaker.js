/**
 * Conference speakers
 *
 * @module      :: Model
 * @description :: System event speakers model
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      eventId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: null
      },

      name: {
        type: we.db.Sequelize.STRING,
        allowNull: false
      },
      about: { type: we.db.Sequelize.TEXT },
      weight: { type: we.db.Sequelize.INTEGER },
      highlighted: {
        type: we.db.Sequelize.BOOLEAN,
        formFieldType: 'boolean',
        defaultsTo: false
      }
    },
    options: {
      imageFields: {
        picture: { formFieldMultiple: false }
      },
      titleField: 'name',
      classMethods: {
        /**
         * Context loader, preload current request record and related data
         *
         * @param  {Object}   req  express.js request
         * @param  {Object}   res  express.js response
         * @param  {Function} done callback
         */
        contextLoader: function contextLoader(req, res, done) {
          if (!res.locals.id || !res.locals.loadCurrentRecord) return done();

          return this.find({
            where: { id: res.locals.id },
            include: [{ all: true }]
          }).then(function (record) {
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

            return done();
          });
        }
      },
      instanceMethods: {
        getUrlPath: function getUrlPath() {
          return we.router.urlTo(
            'cfspeaker.findOne', [this.eventId, this.id]
          );
        }
      }
    }
  }

  return model;
}