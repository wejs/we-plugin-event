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
      about: { type: we.db.Sequelize.TEXT },
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

      logo: { type: we.db.Sequelize.BIGINT, formFieldType: null },
      banner: { type: we.db.Sequelize.BIGINT, formFieldType: null },

      registrationManagerName: { type: we.db.Sequelize.TEXT },
      registrationManagerEmail: {
        type: we.db.Sequelize.STRING(1200),
        validate: { isEmail: true }
      },

      location: { type: we.db.Sequelize.TEXT },

      status: {
        type: we.db.Sequelize.STRING,
        defaultValue: 'salved'
      },
    },
    options: {
      classMethods: {},
      instanceMethods: {
        generateDefaultMenus: function generateDefaultMenus(cb) {
          var menus = [{
            conferenceId: this.id,
            name:  'main',
            class: 'nav navbar-nav navbar-right',
            links: [{
                beforeText: '<i class="fa fa-home"></i>',
                text: 'home',
                afterText: '',
                type: 'path',
                path: '/conference/' + this.id
              },
              {
                beforeText: '',
                text: 'conference.register',
                afterText: '',
                type: 'path',
                path: '/conference/' + this.id + '/register',
                conferenceRoles: ['unRegistered']
              },
              {
                beforeText: '',
                text: 'conference_admin',
                afterText: '',
                type: 'path',
                path: '/conference/' + this.id + '/admin',
                conferenceRoles: ['manager']
              }
            ]
          },{
            conferenceId: this.id,
            name: 'side',
            class: 'nav nav-pills sidebar-menu nav-stacked',
            links: [{
                beforeText: '<i class="fa fa-home"></i>',
                text: 'home',
                afterText: '',
                type: 'path',
                path: '/conference/' + this.id
              },
              {
                beforeText: '<i class="fa fa-location-arrow"></i>',
                text: 'conference.register',
                afterText: '',
                type: 'path',
                path: '/conference/' + this.id + '/register'
              },
              {
                beforeText: '<i class="fa fa-sign-in"></i>',
                text: 'conference_admin',
                afterText: '',
                type: 'path',
                path: '/conference/' + this.id + '/admin',
                conferenceRoles: ['manager']
              }
            ]
          },{
            conferenceId: this.id,
            name: 'admin',
            class: 'nav nav-pills sidebar-menu nav-stacked',
            links: [
              {
                text: 'conference_admin',
                afterText: '',
                type: 'path',
                path: '/conference/' + this.id + '/admin',
                conferenceRoles: ['manager']
              },
              {
                text: 'conference_admin_edit',
                afterText: '',
                type: 'path',
                path: '/conference/' + this.id + '/admin/edit',
                conferenceRoles: ['manager']
              },
              {
                text: 'conference_admin_menu',
                afterText: '',
                type: 'path',
                path: '/conference/' + this.id + '/admin/menu',
                conferenceRoles: ['manager']
              },
              {
                text: 'conference_admin_layouts',
                afterText: '',
                type: 'path',
                path: '/conference/' + this.id + '/admin/layout',
                conferenceRoles: ['manager']
              },
              {
                text: 'conference_findOne.page_manage',
                afterText: '',
                type: 'path',
                path: '/conference/' + this.id + '/admin/page',
                conferenceRoles: ['manager']
              }
            ]
          }];

          we.db.models.cfmenu.bulkCreate(menus).then(function() {
            cb(null);
          }).catch(function (err) {
            cb(err);
          })
        },

        generateDefaultWidgets: function generateDefaultWidgets(cb) {
          var widgets = [{
            title: 'Menu',
            configuration :{
              menu: 'admin',
            },
            type: 'we-cf-menu',
            layout: 'conferenceAdmin',
            theme: 'we-theme-conference',
            context: 'conference-' + this.id,
            regionName: 'sidebar',
            creatorId: this.creatorId
          }, {
            title: 'Menu',
            configuration :{
              menu: 'side',
            },
            type: 'we-cf-menu',
            layout: 'default',
            theme: 'we-theme-conference',
            context: 'conference-' + this.id,
            regionName: 'sidebar',
            creatorId: this.creatorId
          }];

          we.db.models.widget.bulkCreate(widgets).then(function() {
            cb(null);
          }).catch(function (err) {
            cb(err);
          });
        }
      },
      hooks: {
        afterCreate: function afterCreate (record, options, cb) {
          async.parallel([
            record.generateDefaultMenus.bind(record),
            record.generateDefaultWidgets.bind(record)
          ], function (err) {
            cb(err, record);
          });
        }
      }
    }
  }

  return model;
}