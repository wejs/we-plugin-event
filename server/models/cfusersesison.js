/**
 * Conference user session association
 *
 * @module      :: Model
 * @description :: System conference user session association model
 *
 */
module.exports = function Model(we) {
  var model = {
    definition: {},
    associations: {
      session: {
        type: 'belongsTo',
        model : 'cfsession'
      },
      user: {
        type: 'belongsTo',
        model : 'user'
      },
    },
    options: {
      classMethods: {},
      instanceMethods: {},
      hooks: {}
    }
  }

  return model;
}