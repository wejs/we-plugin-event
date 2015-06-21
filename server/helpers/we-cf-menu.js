/**
 * We.js conference menu helper
 *
 * render one conference menu from res.locals.cfmenus
 *
 * usage:  {{#we-cf-menu 'manuName'}} {{/we-cf-menu}}
 */
module.exports = function(we) {
  function renderLinks(links, __) {
    var html = '';
    for (var i = 0; i < links.length; i++) {
      html += renderLink(links[i], __);

      if (links[i].links) {
       html += renderLinks(links, __);
      }
    }
    return html;
  }
  function renderLink(link, __) {
    switch (link.type) {
      case 'route':
        return '<li class="'+(link.class || '')+'"><a href="'+we.router.urlTo(link.name, link.params, we)+'" '+
        (link.attrs || '')+'>'+(link.beforeText || '')+
        ' '+__(link.text)+
          ' '+ (link.afterText || '') + '</a></li>';
      case 'path':
        return '<li class="'+(link.class || '')+'"><a href="'+link.path+'" '+
        (link.attrs || '')+'>'+(link.beforeText || '')+
        ' '+__(link.text)+
          ' '+ (link.afterText || '') + '</a></li>';
        return '';
      case 'external':
        return '<li class="'+(link.class || '')+'"><a href="'+link.href+'" '+(link.attrs || '')+'>'+
        (link.beforeText || '') +' '+__(link.text)+
          ' '+ (link.afterText || '') + '</a></li>';
      default:
        return '';
    }
  }

  return function renderWidget(name) {
    var options = arguments[arguments.length-1];
    var __ = (this.__ || we.i18n.__);
    var menu;
    var menus = ( options.data.root.cfmenu || options.data.root.locals.cfmenu );

    if (!menus) return '';
    for (var i = 0; i < menus.length; i++) {
      if (menus[i].name === name ) {
        menu = menus[i];
      }
    };

    if (!menu) return '';

    var links =  menu.links;

    var attributes = [];
    // pass helper attributes to link element
    for (var attributeName in options.hash) {
      attributes.push(attributeName + '="' + options.hash[attributeName] + '"');
    }

    var html = '<ul class="'+(menu.class || '')+'" '+ attributes.join(' ') +'>';

    html += renderLinks(links, __);

    html += '</ul>';

    return new we.hbs.SafeString(html);
  }
}
