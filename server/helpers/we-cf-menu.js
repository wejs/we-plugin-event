/**
 * We.js event menu render helper
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
    var options = arguments[arguments.length-1];

    if (!menu) return '';

    var links =  menu.links;

    var classes = options.hash.class || '';
    if (menu.class && !options.hash.skipMenuClass) classes += ' ' + menu.class;

    var html = '<ul';
      if (classes) html += ' class="'+classes+'" ';
    html += '>'

    html += renderLinks(links);

    html += '</ul>';

    return new we.hbs.SafeString(html);
  }
}
