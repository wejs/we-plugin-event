/**
 * Conference session
 *
 * @module      :: Model
 * @description :: System event session model
 *
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      eventId: {
        type: we.db.Sequelize.BIGINT, allowNull: false, formFieldType: null
      },

      title: { type:  we.db.Sequelize.STRING(1200) },
      about: { type: we.db.Sequelize.TEXT, formFieldType: 'html', formFieldHeight: 200 },

      startDate: { type: we.db.Sequelize.DATE },
      endDate: { type: we.db.Sequelize.DATE },

      topicIdSelector: { type: we.db.Sequelize.VIRTUAL, formFieldType: 'cftopic-selector' },

      roomIdSelector: { type: we.db.Sequelize.VIRTUAL, formFieldType: 'cfroom-selector' },

      requireRegistration: {
        type: we.db.Sequelize.BOOLEAN, defaultValue: false,
        formFieldType: 'boolean'
      },
      // requested, registered
      status: {
        type: we.db.Sequelize.STRING,
        defaultValue: 'send',
        formFieldType: 'select' ,
        fieldOptions: {
          send: 'event.cfsession.status.send',
          'in_review': 'event.cfsession.status.in_review',
          'need_update': 'event.cfsession.status.need_update',
          accepted: 'event.cfsession.status.accepted',
          discarded: 'event.cfsession.status.discarded'
        }
      },

      vacancy: {
        type: we.db.Sequelize.VIRTUAL,
        formFieldType: null,
        get: function() {
          var room = this.getDataValue('room');
          if (this.getDataValue('requireRegistration') && room) {
            return room.vacancy;
          }
          return null;
        }
      },

      /**
       * variable to check if have vacancy in this session
       * load cf session room and subscribers after use id
       *
       * @type {Object}
       */
      haveVacancy: {
        type: we.db.Sequelize.VIRTUAL,
        formFieldType: null,
        get: function() {
          if (!this.getDataValue('requireRegistration')) return true;

          var room = this.getDataValue('room');
          if (room) {
            var subscribers = this.getDataValue('subscribers');
            if (subscribers.length < room.vacancy) return true;
          }
          return false;
        }
      }
    },
    associations: {
      topic: { type: 'belongsTo', model: 'cftopic' },
      room: { type: 'belongsTo', model: 'cfroom' },
      user: { type: 'belongsTo', model: 'user' },
      subscribers: {
        type: 'belongsToMany',
        through: 'cfsessionSubscriber',
        model: 'cfregistration'
      }
    },
    options: {
      titleField: 'title',
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
            res.locals.record = record;

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
        getSubscriberCount: function getSubscriberCount() {
          return we.db.models.cfsessionSubscriber.count({
            where: { cfsessionId: this.id }
          });
        }
      },
      hooks: {
        beforeCreate: function beforeCreate(record, options, next) {
          record.status = 'send';
          next();
        }
      },
      imageFields: {
        picture: { formFieldMultiple: false }
      }
    }
  }

  return model;
}