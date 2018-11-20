/**
 * CF Vídeo Model
 *
 * @module      :: Model
 * @description :: cfvideo model
 *
 */
const vui = require('video-url-inspector');

module.exports = function CfVideoModel(we) {
  // set sequelize model define and options
  const model = {
    definition: {
      creatorId: { type: we.db.Sequelize.BIGINT, formFieldType: null },
      eventId: { type: we.db.Sequelize.BIGINT, formFieldType: null },

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
       get()  {
        let thumbs = this.getDataValue('thumbnails');
          if (thumbs && (typeof thumbs == 'string')){
            try {
              return JSON.parse( thumbs );
            } catch (e) {
              console.error('Error on parse cfvideo.thumbnail:', e, thumbs);
            }
          }
          return {};
        },
        set(object) {
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
          })
          .catch(done);
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
            'cfvideo.findOne', [this.eventId, this.id]
          );
        }
      },
      titleField: 'title',
      hooks: {
        // Lifecycle Callbacks
        beforeCreate(record, options) {
          return parseVideoData(record, options);
        },
        beforeUpdate: function(record, options) {
          return parseVideoData(record, options);
        }
      }
    }
  };

  return model;
}

function parseVideoData(record) {
  return new Promise((resolve)=> {
    let videoData = vui(record.url);

    if (videoData.embedUrl) {
      record.embedUrl = videoData.embedUrl;
    } else {
      record.embedUrl = videoData.url;
    }

    record.provider = videoData.hoster;
    record.idInProvider = videoData.remoteId;
    record.thumbnails = videoData.thumbnails;

    resolve(record);
  });
}