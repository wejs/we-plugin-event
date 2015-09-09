/**
 * We.js conference registration btn
 *
 * render one conference registration btn
 *
 * usage:  {{we-cf-registration-btn event=eventRecord locals=locals
 *           class=""
 *           classClosedAfter=""
 *           classClosedNoVacancies=""
 *           classOpen=""
 *           classClosedBefore=""
 *           classClosed=""
 *         }}
 */
module.exports = function(we) {
  return function renderRegistrationBTN() {
    var options = arguments[arguments.length-1];
    var ctx = {
      disabled: ' disabled="disabled" ',
      btnClass: (options.hash.class || 'btn') + ' ',
      href: '#',
      text: options.hash.locals.__('event.btn.'+options.hash.event.registrationStatus)
    };

    switch(options.hash.event.registrationStatus) {
      case 'closed_after':
        ctx.btnClass += (options.hash.classClosedAfter || 'btn-danger');
        break;
      case 'closed_no_vacancies':
        ctx.btnClass += (options.hash.classClosedNoVacancies || 'btn-danger');
        break;
      case 'open':
        ctx.btnClass += (options.hash.classOpen || 'btn-default');
        ctx.disabled = '';
        break;
      case 'closed_before':
        ctx.btnClass += (options.hash.classClosedBefore || 'btn-danger');
        break;
      default:
        ctx.btnClass += (options.hash.classClosed || 'btn-danger');
    }

    var theme = options.hash.locals.theme;
    // if not find the theme name get default themes
    if (!theme) theme = we.view.themes[we.view.appTheme];
    // render the template
    return new we.hbs.SafeString(we.view.renderTemplate('event/registration-btn', theme, ctx));
  }
};