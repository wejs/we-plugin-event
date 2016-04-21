/**
 * We.js event menu helper
 *
 * render one event menu
 *
 * usage:  {{we-cf-menu cfmenu}}
 */
module.exports = function(we) {
  function renderLinks(links) {
    var html = '';

    if (!links) return html;

    for (var i = 0; i < links.length; i++) {
      html += renderLink(links[i]);

      if (links[i].links) {
       html += renderLinks(links[i].links);
      }
    }
    return html;
  }
  function renderLink(link) {
    return '<li><a class="'+(link.class || '')+'" href="'+link.href+'">'+link.text + '</a></li>';
  }

  return function renderWidget(menu) {

    if (!menu) return '';

    var links =  menu.links;

    var html = '<ul class="'+(menu.class || '')+'">';

    html += renderLinks(links);

    html += '</ul>';

    return new we.hbs.SafeString(html);
  }
}
