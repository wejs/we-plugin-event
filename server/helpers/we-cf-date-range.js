/**
 * We.js event date range
 *
 * render one date range
 *
 * usage:  {{we-cf-date-range start=date end=date __=__}}
 */
module.exports = function(we) {
  return function renderDateRange() {
    var options = arguments[arguments.length-1];

    var start = we.utils.moment(options.hash.start);
    var end = we.utils.moment(options.hash.end);

    var __ = ( options.hash.__ || we.i18n.__ );

    // dd/mm a dd/mm de aaaa
    return new we.hbs.SafeString(__('event.date.range', {
      start: start.format('DD/MM'),
      end: end.format('DD/MM'),
      yearStart: start.format('YYYY'),
      yearEnd: end.format('YYYY')
    }));
  }
};