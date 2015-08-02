/**
 * Conference
 *
 * @module      :: Model
 * @description :: System conference model
 *
 */
var async = require('async');

module.exports = function Model(we) {
  var model = {
    definition: {
      creatorId: { type: we.db.Sequelize.BIGINT, formFieldType: null },
      title: { type: we.db.Sequelize.STRING(1500), allowNull: false },
      // unique name used in url
      abbreviation: { type:  we.db.Sequelize.STRING, unique: true },
      about: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },
      email: {
        type: we.db.Sequelize.STRING(1500),
        validate: { isEmail: true }
      },
      // conference dates
      callForPapersStartDate: { type: we.db.Sequelize.DATE },
      callForPapersEndDate: { type: we.db.Sequelize.DATE },
      registrationStartDate: { type: we.db.Sequelize.DATE },
      registrationEndDate: { type: we.db.Sequelize.DATE },
      eventStartDate: { type: we.db.Sequelize.DATE },
      eventEndDate: { type: we.db.Sequelize.DATE },

      registrationManagerName: { type: we.db.Sequelize.TEXT },
      registrationManagerEmail: {
        type: we.db.Sequelize.STRING(1200),
        validate: { isEmail: true }
      },

      vacancies: {
        type: we.db.Sequelize.INTEGER,
        formFieldType: 'number'
      },

      location: { type: we.db.Sequelize.TEXT },

      published: {
        type: we.db.Sequelize.BOOLEAN, defaultValue: true ,
        formFieldType: 'boolean'
      },

      registrationEmail: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },
      registrationWaitingAccept: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },
      registeredText: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      }
    },
    associations: {
      managers: {
        type: 'belongsToMany',
        through: 'cfmanager',
        model: 'user'
      },
      mainMenu: {
        type: 'belongsTo',
        model: 'cfmenu'
      },
      secondaryMenu: {
        type: 'belongsTo',
        model: 'cfmenu'
      },
      socialMenu: {
        type: 'belongsTo',
        model: 'cfmenu'
      },
      topics: {
        type: 'hasMany',
        model: 'cftopic'
      }
    },
    options: {
      titleField: 'title',
      termFields: {
        tags: {
          vocabularyName: null,
          canCreate: true,
          formFieldMultiple: true,
          onlyLowercase: true
        },
        categories: {
          vocabularyName: 'Category',
          canCreate: false,
          formFieldMultiple: false
        }
      },

      imageFields: {
        logo: { formFieldMultiple: false },
        banner: { formFieldMultiple: false },
        favicon: { formFieldMultiple: false }
      },

      classMethods: {},
      instanceMethods: {
        generateDefaultMenus: function generateDefaultMenus(cb) {
          var self = this;

          async.series([
            function (done) {
              we.db.models.cfmenu.create({
                conferenceId: self.id,
                name:  'main',
                class: 'nav navbar-nav navbar-right'
              }).then(function (m) {
                self.setMainMenu(m);

                done();
              }).catch(done)
            },
            function (done) {
              we.db.models.cfmenu.create({
                conferenceId: self.id,
                name: 'secondary',
                class: 'nav nav-pills sidebar-menu nav-stacked'
              }).then(function (m) {
                self.setSecondaryMenu(m);

                done();
              }).catch(done)
            },
            function (done) {
              we.db.models.cfmenu.create({
                conferenceId: self.id,
                name: 'social',
                class: 'list-inline join-us'
              }).then(function (m) {
                self.setSocialMenu(m);
                done();
              }).catch(done)
            }
          ], cb);
        },

        generateDefaultWidgets: function generateDefaultWidgets(cb) {
          return cb();
          // var widgets = [{
          //   title: 'Menu',
          //   configuration :{
          //     menu: 'admin',
          //   },
          //   type: 'we-cf-menu',
          //   layout: 'conferenceAdmin',
          //   theme: 'we-theme-conference',
          //   context: 'conference-' + this.id,
          //   regionName: 'sidebar',
          //   creatorId: this.creatorId
          // }, {
          //   title: 'Menu',
          //   configuration :{
          //     menu: 'side',
          //   },
          //   type: 'we-cf-menu',
          //   layout: 'default',
          //   theme: 'we-theme-conference',
          //   context: 'conference-' + this.id,
          //   regionName: 'sidebar',
          //   creatorId: this.creatorId
          // }];

          // we.db.models.widget.bulkCreate(widgets).then(function() {
          //   cb(null);
          // }).catch(function (err) {
          //   cb(err);
          // });
        }
      },
      hooks: {
        afterCreate: function afterCreate (record, options, cb) {
          async.parallel([
            record.generateDefaultMenus.bind(record),
            record.generateDefaultWidgets.bind(record),
            function addCreatorAsManager(done) {
              record.addManager(record.creatorId).then(function(){
                done();
              }).catch(done);
            }
          ], function (err) {
            cb(err, record);
          });
        }
      }
    }
  }

  return model;
}