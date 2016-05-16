module.exports = {
  /**
   * Install function run in we.js install.
   *
   * @param  {Object}   we    we.js object
   * @param  {Function} done  callback
   */
  install: function install(we, done) {
    we.utils.async.series([
      function createEventsListWidgets(done) {
        if (!we.plugins['we-plugin-widget']) return done();

        we.db.models.widget.bulkCreate([
          {
            title: null,
            type: 'we-cf-search-form',
            path: '/event',
            layout: 'default',
            regionName: 'highlighted'
          },
          {
            title: null,
            type: 'we-cf-events-menu',
            path: '/event',
            layout: 'default',
            regionName: 'sidebar'
          }
        ]).spread(function afterCreateEventWidgets() {
          done();
        }).catch(done);
      }
    ], done);
  },
  /**
   * Return a list of updates
   *
   * @param  {Object} we we.js object
   * @return {Array}    a list of update objects
   */
  updates: function updates() {
    return [
      {
        version: '0.3.27',
        /**
         * Add present column
         */
        update: function update0327(we, done) {
          we.utils.async.series([
            function (done) {
              var sql = 'ALTER TABLE `cfregistrations` ADD '+
                ' COLUMN `present` TINYINT(1) NOT NULL DEFAULT 0;';
              we.db.defaultConnection.query(sql).then(function(){
                done();
              }).catch(done);
            },
            function(done) {
              var sql = 'ALTER TABLE `events` ADD '+
                ' COLUMN `theme` VARCHAR(250);';
              we.db.defaultConnection.query(sql).then(function(){
                done();
              }).catch(done);
            }
          ], done);
        }
      },
      {
        version: '0.3.31',
        /**
         * Add present column
         */
        update: function update0331(we, done) {
          we.utils.async.series([
            function (done) {
              var sql = 'ALTER TABLE `cftopics` ADD '+
                ' COLUMN `eventId` INT';
              we.db.defaultConnection.query(sql).then(function(){
                done();
              }).catch(function (err){
                we.log.error(err);
                done();
              });
            }
          ], done);
        }
      },
      {
        version: '0.3.45',
        /**
         * Add present column
         */
        update: function update0345(we, done) {
          we.utils.async.series([
            function (done) {
              var sql = 'ALTER TABLE `cfsessionSubscribers` ADD COLUMN `present` TINYINT(1) NOT NULL DEFAULT 0';
              we.db.defaultConnection.query(sql).then(function(){
                done();
              }).catch(function (err){
                we.log.error(err);
                done();
              });
            },
            function (done) {
              var sql = ' ALTER TABLE `events` ADD COLUMN `workload` INT(11)';
              we.db.defaultConnection.query(sql).then(function(){
                done();
              }).catch(function (err){
                we.log.error(err);
                done();
              });
            }
          ], done);
        }
      },
      {
        version: '0.3.47',
        /**
         * Add present column
         */
        update: function update0347(we, done) {
          we.utils.async.series([
            function (done) {
              var sql = 'ALTER TABLE `cfcontacts` ADD COLUMN `status` '+
                'VARCHAR(45) NULL DEFAULT \'new\' `';
              we.db.defaultConnection.query(sql).then(function(){
                done();
              }).catch(function (err){
                we.log.error(err);
                done();
              });
            },
            function (done) {
              var sql = 'UPDATE `cfcontacts` SET `status`=\'opened\'';
              we.db.defaultConnection.query(sql).then(function(){
                done();
              }).catch(function (err){
                we.log.error(err);
                done();
              });
            }
          ], done);
        }
      },
      {
        version: '0.3.64',
        /**
         * Add isOnline column
         */
        update: function (we, done) {
          we.utils.async.series([
            function (done) {
              var sql = 'ALTER TABLE `events` ADD COLUMN `isOnline`'+
                ' TINYINT(1) NOT NULL DEFAULT 0';
              we.db.defaultConnection.query(sql).then(function(){
                done();
              }).catch(function (err){
                if (err) {
                  we.log.error(err);
                }
                done();
              });
            },
            function (done) {
              we.db.models.widget.bulkCreate([
                {
                  title: null,
                  type: 'we-cf-search-form',
                  path: '/event',
                  layout: 'default',
                  regionName: 'highlighted'
                },
                {
                  title: null,
                  type: 'we-cf-events-menu',
                  path: '/event',
                  layout: 'default',
                  regionName: 'sidebar'
                }
              ]).spread(function afterCreateEventWidgets() {
                done();
              }).catch(done);
            }
          ], done);
        }
      },
      {
        version: '1.0.0',
        update: function (we, done) {
          we.utils.async.series([
            function (done) {
              var sql = 'ALTER TABLE `cfregistrationtypes` ADD COLUMN `startDate`'+
                ' DATETIME ';
              we.db.defaultConnection.query(sql).then(function(){
                done();
              }).catch(function (err){
                if (err) {
                  we.log.error(err);
                }
                done();
              });
            },
            function (done) {
              var sql = 'ALTER TABLE `cfregistrationtypes` ADD COLUMN `endDate`'+
                ' DATETIME ';
              we.db.defaultConnection.query(sql).then(function(){
                done();
              }).catch(function (err){
                if (err) {
                  we.log.error(err);
                }
                done();
              });
            }
          ], done);
        }
      }
    ];
  }
};
