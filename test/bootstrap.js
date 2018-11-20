const projectPath = process.cwd(),
  deleteDir = require('rimraf'),
  testTools = require('we-test-tools'),
  path = require('path'),
  fs = require('fs-extra');


let we;

before(function(callback) {
  // copy test.js settings file:
  fs.copySync(
    path.resolve(process.cwd(), 'test', 'test.js.example'),
    path.resolve(process.cwd(), 'config', 'local.js')
  );

  callback();
});

before(function(callback) {
  this.slow(100);
  this.timeout(30000);

  const We = require('we-core');
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
  });
});

//after all tests
after(function (callback) {
  we.db.defaultConnection.close();

  const tempFolders = [
    projectPath + '/files/tmp',
    projectPath + '/files/config',
    projectPath + '/files/sqlite',
    projectPath + '/files/public/min',
    projectPath + '/files/public/tpls.hbs.js',
    projectPath + '/files/public/admin.tpls.hbs.js',
    projectPath + '/files/public/project.css',
    projectPath + '/files/public/project.js',
    projectPath + '/config/local.js',
    projectPath + '/db_test.sqlite',
    projectPath + '/sessions',
    projectPath + '/db_test_session.sqlite'
  ];

  we.utils.async.each(tempFolders, function(folder, next){
    deleteDir( folder, next);
  }, function(err) {
    if (err) throw new Error(err);
    callback();
  });
});

after(function () {
  process.exit();
});