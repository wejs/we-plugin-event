/**
 * Conference registration
 *
 * @module      :: Model
 * @description :: System conference registration model
 */
module.exports = function Model(we) {
  var model = {
    definition: {
      conferenceId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: null
      },

      cfregistrationtypeId: {
        type: we.db.Sequelize.BIGINT,
        allowNull: false,
        formFieldType: 'cf-type-selector'
      },

      specialRequirements: {
        type: we.db.Sequelize.TEXT,
        allowNull: true
      },

      // requested, registered
      status: {
        type: we.db.Sequelize.STRING,
        defaultValue: 'requested',
        formFieldType: null
      },

      displayName: {
        type: we.db.Sequelize.VIRTUAL,
        formFieldType: null,
        get: function get() {
          var user = this.getDataValue('user');
          if (!user) return null;
          return user.getDataValue('displayName');
        }
      },
      email: {
        type: we.db.Sequelize.VIRTUAL,
        formFieldType: null,
        get: function get() {
          var user = this.getDataValue('user');
          if (!user) return null;
          return user.getDataValue('email');
        }
      },
      cpf: {
        type: we.db.Sequelize.VIRTUAL,
        formFieldType: null,
        get: function get() {
          var user = this.getDataValue('user');
          if (!user) return null;
          return user.getDataValue('cpf');
        }
      }
    },
    associations: {
      user: {
        type: 'belongsTo',
        model: 'user'
      },
      sessions: {
        type: 'belongsToMany',
        through: 'cfsessionSubscriber',
        model: 'cfsession'
      }
    },
    options: {
      classMethods: {},
      instanceMethods: {
        toJSON: function toJSON() {
          var obj = this.get();
          delete obj.deletedAt;
          return obj;
        }
      },
      // TODO check if user is already registered in conference
      hooks: {}
    }
  }

  return model;
}