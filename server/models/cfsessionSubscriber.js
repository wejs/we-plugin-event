/**
 * Conferece session subscribers join model
 *
 * @module      :: Model
 * @description :: Store session subscribers associations
 */

module.exports = function Model(we) {
  var model = {
    definition: {
      present: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: false,
        formFieldType: null
      }
    },
    options: {
      paranoid: false ,
      instanceMethods: {
        getUrlPath: function getUrlPath() {
          return null;
        }
      }
    }
  };
  return model;
};