/**
 * We.js event date range
 *
 * render one date range
 *
 * usage:  {{we-cf-date-range start=date end=date __=__}}
 */
module.exports = function(we) {
  return function renderDateRange() {
    const options = arguments[arguments.length-1];

    let start = we.utils.moment(options.hash.start);
    let end = we.utils.moment(options.hash.end);

    if (!start.isValid() || !end.isValid()) return '';

    let __ = ( options.hash.__ || we.i18n.__ );

    // dd/mm a dd/mm de aaaa
    return new we.hbs.SafeString(__('event.date.range', {
      start: start.format('DD/MM'),
      end: end.format('DD/MM'),
      yearStart: start.format('YYYY'),
      yearEnd: end.format('YYYY')
    }));
  }
};