var projectPath = process.cwd();
var deleteDir = require('rimraf');
var testTools = require('we-test-tools');
var path = require('path');
var we;

before(function(callback) {
  this.slow(100);
  this.timeout(30000);

  testTools.copyLocalConfigIfNotExitst(projectPath, function() {
    var We = require('we-core');
    we = new We();

    testTools.init({}, we);

    we.bootstrap({
      port: 9800,
      i18n: {
        directory: path.resolve(__dirname, '../config', 'locales'),
        updateFiles: true
      },
      event: {
        themes: ['we-theme-event'],
        defaultTheme: 'we-theme-event'
      },
      themes: {
        enabled: [
          'we-theme-event',
          'we-theme-pratt',
          'we-theme-admin-default',
        ],
        app: 'we-theme-pratt',
        admin: 'we-theme-admin-default'
      }
    } , function(err, we) {
      if (err) throw err;

      we.startServer(function(err) {
        if (err) throw err;
        callback();
      })
    })
  })
})

//after all tests
after(function (callback) {
  we.db.defaultConnection.close();

  var tempFolders = [
    projectPath + '/files/tmp',
    projectPath + '/files/config',
    projectPath + '/files/sqlite',
    projectPath + '/files/public/min',
    projectPath + '/files/public/tpls.hbs.js',
    projectPath + '/files/public/admin.tpls.hbs.js',
    projectPath + '/files/public/project.css',
    projectPath + '/files/public/project.js',
    projectPath + '/config/local.js'
  ];

  we.utils.async.each(tempFolders, function(folder, next){
    deleteDir( folder, next);
  }, function(err) {
    if (err) throw new Error(err);
    callback();
  });
});