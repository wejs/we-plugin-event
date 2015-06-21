/**
 * Conferece menu model
 *
 * @module      :: Model
 * @description :: Store conference menu config
 */

module.exports = function Model(we) {
  var model = {
    definition: {
      /**
       * conference Id
       */
      conferenceId: {
        type:  we.db.Sequelize.BIGINT
      },

      name: {
        type:  we.db.Sequelize.STRING,
      },

      links: {
        type:  we.db.Sequelize.TEXT,
        get: function()  {
          if (this.getDataValue('links'))
            return JSON.parse( this.getDataValue('links') );
          return {};
        },
        set: function(object) {
          if (typeof object == 'object') {
            this.setDataValue('links', JSON.stringify(object));
          } else {
            throw new Error('invalid error in conference menu links value: ', object);
          }
        }
      }
    }
  }

  return model;
};