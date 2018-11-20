/**
 * We.js event menu render helper
 *
 * usage:  {{we-cf-menu cfmenu}}
 */
module.exports = function(we) {
  function renderLinks(links) {
    let html = '';

    if (!links) return html;

    for (let i = 0; i < links.length; i++) {
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
    const options = arguments[arguments.length-1];

    if (!menu) return '';

    let links =  menu.links;

    let classes = options.hash.class || '';
    if (menu.class && !options.hash.skipMenuClass) classes += ' ' + menu.class;

    let html = '<ul';
      if (classes) html += ' class="'+classes+'" ';
    html += '>'

    html += renderLinks(links);

    html += '</ul>';

    return new we.hbs.SafeString(html);
  }
}
