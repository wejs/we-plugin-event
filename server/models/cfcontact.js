/**
 * Conferece Contact model
 *
 * @module      :: Model
 * @description :: Store event contact messages
 */
 module.exports = function Model(we) {
  var model = {
    definition: {
      eventId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: null
      },
      creatorId: {
        type: we.db.Sequelize.BIGINT,
        formFieldType: null
      },
      name: {
        type:  we.db.Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: we.db.Sequelize.STRING,
        formFieldType: 'email',
        validate: { isEmail: true },
        allowNull: false
      },
      message: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'textarea',
        formFieldAttributes: {
          rows: 6
        },
        allowNull: false
      },
      status: {
        type: we.db.Sequelize.STRING,
        defaultValue: 'opened',
        formFieldType: null,
      },
      statusClass: {
        type: we.db.Sequelize.VIRTUAL,
        get: function() {
          if (this.getDataValue('status') == 'opened') {
            return 'danger'
          } else if(this.getDataValue('status') == 'closed'){
            return 'success'
          }

          return '';
        }
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
      }
    }
  }
  return model;
 };
