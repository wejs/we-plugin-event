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
      }
    }
  }
  return model;
 };
