/**
 * Conference session
 *
 * @module      :: Model
 * @description :: System conference session model
 *
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      conferenceId: {
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
          send: 'conference.cfsession.status.send',
          'in_review': 'conference.cfsession.status.in_review',
          'need_update': 'conference.cfsession.status.need_update',
          accepted: 'conference.cfsession.status.accepted',
          discarded: 'conference.cfsession.status.discarded'
        }
      },

      haveVacancy: {
        type: we.db.Sequelize.VIRTUAL,
        formFieldType: null,
        get: function() {
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
      classMethods: {},
      instanceMethods: {},
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