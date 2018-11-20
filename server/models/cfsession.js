/**
 * Conference session
 *
 * @module      :: Model
 * @description :: System event session model
 *
 */
module.exports = function CfSessionModel(we) {
  const model = {
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
        get() {
          let room = this.getDataValue('room');
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
        get() {
          if (!this.getDataValue('requireRegistration')) return true;

          let room = this.getDataValue('room');
          if (room) {
            let subscribers = this.getDataValue('subscribers');
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
          });
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
            'cfsession.findOne', [this.eventId, this.id]
          );
        },
        getSubscriberCount() {
          return we.db.models.cfsessionSubscriber.count({
            where: { cfsessionId: this.id }
          });
        },
        /**
         * Check if current cfsession record have conflict with sessions list
         *
         * @param  {Object} sessions
         * @return {Boolean}
         */
        haveTimeConflict(sessions) {
          if (!sessions) return false;

          for (let i = 0; i < sessions.length; i++) {
            if (
              (this.startDate <= sessions[i].endDate)  &&
              (this.endDate >= sessions[i].startDate)
            ){
              return true;
            }
          }
        }
      },
      hooks: {
        beforeCreate(record) {
          record.status = 'send';
        }
      },
      imageFields: {
        picture: { formFieldMultiple: false }
      }
    }
  }

  return model;
}