/**
 * Widget we-cf-search-form main file
 *
 * See https://github.com/wejs/we-core/blob/master/lib/class/Widget.js for all Widget prototype functions
 */

module.exports = function (projectPath, Widget) {
  var widget = new Widget('we-cf-search-form', __dirname);

  widget.checkIfIsValidContext = function checkIfIsValidContext(context) {
    if (context) { return false; }
  };
  widget.isAvaibleForSelection = function isAvaibleForSelection(req) {
    if (req.res.locals.eventSearch) return true;
    if (req.res.locals.widgetContext) { return false; }
  };
  // widget.beforeSave = widgetUtils.beforeSave;
  widget.renderVisibilityField = function renderVisibilityField(widget, context, req, res) {
    var field = '';

    // visibility field
    field += '<div class="form-group"><div class="row">' +
      '<label class="col-sm-4 control-label">'+
      res.locals.__('widget.visibility') + '</label>'+
    '<div class="col-sm-8"><select name="visibility" class="form-control">';
      field +=
      '<option value="in-page" selected>'+
        res.locals.__('widget.in-page')+
      '</option>'+
    '</select></div></div>'+
    '</div><hr>';

    return field;
  };

  return widget;
};