/**
 * CF Vídeo Model
 *
 * @module      :: Model
 * @description :: cfvideo model
 *
 */
var vui = require('video-url-inspector');

module.exports = function Model(we) {
  // set sequelize model define and options
  var model = {
    definition: {
      creatorId: { type: we.db.Sequelize.BIGINT, formFieldType: null },
      conferenceId: { type: we.db.Sequelize.BIGINT, formFieldType: null },

      // video url
      url: { type: we.db.Sequelize.STRING(1500), allowNull:false },

      title: { type: we.db.Sequelize.STRING(1500) },
      description: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 200
      },
      // video provider name
      provider: { type: we.db.Sequelize.STRING, formFieldType: null },
      // video id parsed from provider
      idInProvider: { type: we.db.Sequelize.STRING, formFieldType: null },
      // parsed video url
      embedUrl: { type: we.db.Sequelize.STRING(1500), formFieldType: null },
      // video thumbnails
      thumbnails: { type: we.db.Sequelize.TEXT, formFieldType: null,
       get: function()  {
          if (this.getDataValue('thumbnails'))
            return JSON.parse( this.getDataValue('thumbnails') );
          return {};
        },
        set: function(object) {
          if (typeof object == 'object') {
            this.setDataValue('thumbnails', JSON.stringify(object));
          } else {
            throw new Error('invalid error in cfvideo thumbnails value: ', object);
          }
        }
      }
    },
    options: {
      termFields: {
        categories: {
          vocabularyName: 'Category',
          canCreate: false,
          formFieldMultiple: false
        },
        tags: {
          vocabularyName: null,
          canCreate: true,
          formFieldMultiple: true,
          onlyLowercase: true
        }
      },
      titleField: 'title',
      hooks: {
        // Lifecycle Callbacks
        beforeCreate: function(record, options, next) {
          parseVideoData(record, options, next);
        },
        beforeUpdate: function(record, options, next) {
          parseVideoData(record, options, next);
        }
      }
    }
  };

  return model;
}

function parseVideoData(record, options, next) {
  var videoData = vui(record.url);

  if (videoData.embedUrl) {
    record.embedUrl = videoData.embedUrl;
  } else {
    record.embedUrl = videoData.url;
  }

  record.provider = videoData.hoster;
  record.idInProvider = videoData.remoteId;
  record.thumbnails = videoData.thumbnails;

  next(null, record);
}