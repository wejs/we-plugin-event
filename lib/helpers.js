var linkSortAttrs = ['weight', 'id', 'depth', 'parent'];

module.exports = {
  parseLinksFromBody: function parseLinksFromBody(req) {
    var itensToSave = {};
    var linkAttrs;
    for (var item in req.body) {
      linkAttrs = item.split('-');

      if (linkAttrs.length !== 3) continue;
      if (linkAttrs[0] !== 'link') continue;
      if (req.we.utils._.isNumber(linkAttrs[1])) continue;
      if (linkSortAttrs.indexOf(linkAttrs[2]) === -1) continue;

      if (!itensToSave[linkAttrs[1]]) itensToSave[linkAttrs[1]] = {};

      itensToSave[linkAttrs[1]][linkAttrs[2]] = req.body[item];
    }

    return itensToSave;
  }
}