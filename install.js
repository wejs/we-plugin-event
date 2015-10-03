module.exports = {
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
              var sql = ' ALTER TABLE `event` ADD COLUMN `workload` INT(11)';
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
      }
    ];
  }
};
