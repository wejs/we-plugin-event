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
              var sql = 'ALTER TABLE `conferences` ADD '+
                ' COLUMN `theme` VARCHAR(250);';
              we.db.defaultConnection.query(sql).then(function(){
                done();
              }).catch(done);
            }
          ], function(){

          });
        }
      }
    ];
  }
};