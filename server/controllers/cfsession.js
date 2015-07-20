module.exports = {
  find: function findAll(req, res, next) {
    var we = req.getWe();

    res.locals.query.order = [
      ['startDate', 'ASC'], ['createdAt', 'ASC']
    ];
    return res.locals.Model.findAndCountAll(res.locals.query)
    .then(function (record) {
      if (!record) return next();

      var activeSet = false;

      res.locals.metadata.count = record.count;
      res.locals.record = record.rows;

      res.locals.days = {};
      var nodayString = req.__('cfsession.no.date');

      res.locals.record.forEach(function (r) {
        if (!r.startDate) return;
        var sdate = we.utils.moment(r.startDate)
        var day;

        if (we.utils.moment(r.startDate).isValid()) {
          day = sdate.locale(we.config.i18n.defaultLocale).format('L');
        } else {
          day = nodayString
        }

        if (!res.locals.days[day]) {
          res.locals.days[day] = {
            text: day,
            cfsession: []
          };

          if (!activeSet && day != nodayString) {
            res.locals.days[day].active = true;
            activeSet = true;
          }
        }

        res.locals.days[day].cfsession.push(r);
      });

      // reorder nodaystring
      if (res.locals.days[nodayString]) {
        var reord = res.locals.days[nodayString];
        delete res.locals.days[nodayString];
        res.locals.days[nodayString] = reord;
      }

      return res.ok();
    });
  }

};