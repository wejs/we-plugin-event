/**
 * We.js event registration btn
 *
 * render one event registration btn
 *
 * usage:  {{we-cf-registration-btn event=eventRecord userCfregistration="" locals=locals
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

    var id = options.hash.event.id;

    if (
      options.hash.userCfregistration &&
      ( options.hash.userCfregistration.status == 'registered' )
    ) {
      // user is registered in this event
      ctx.btnClass += (options.hash.classOpen || 'btn-default cf-btn-registered');
      ctx.disabled = '';
      ctx.href = '/event/'+id+'/register';
      ctx.text = options.hash.locals.__('event.btn.registered');
    } else {
      // user not is registered then check btn registration status
      switch(options.hash.event.registrationStatus) {
        case 'closed_after':
          ctx.btnClass += (options.hash.classClosedAfter || 'btn-danger cf-btn-closed_after');
          break;
        case 'closed_no_vacancies':
          ctx.btnClass += (options.hash.classClosedNoVacancies || 'btn-danger cf-btn-closed_no_vacancies');
          break;
        case 'open':
          ctx.btnClass += (options.hash.classOpen || 'btn-default cf-btn-open');
          ctx.disabled = '';
          ctx.href = '/event/'+id+'/register';
          break;
        case 'closed_before':
          ctx.btnClass += (options.hash.classClosedBefore || 'btn-danger cf-btn-closed_before');
          break;
        default:
          ctx.btnClass += (options.hash.classClosed || 'btn-danger cf-btn-closed');
      }
    }

    var theme = options.hash.locals.theme;
    // if not find the theme name get default themes
    if (!theme) theme = we.view.themes[we.view.appTheme];
    // render the template
    return new we.hbs.SafeString(we.view.renderTemplate('event/registration-btn', theme, ctx));
  }
};