var util =  {
  checkIfIsValidContext: function checkIfIsValidContext(context) {
    if (!context || context.indexOf('event-') !== 0) {
      return false;
    } else {
      return true
    }
  },

  isAvaibleForSelection: function isAvaibleForSelection(req) {
    if (util.checkIfIsValidContext(req.res.locals.widgetContext)) {
      return true;
    } else {
      return false;
    }
  },
  beforeSave: function widgetBeforeSave(req, res, next) {
    // check context in create
    if (res.locals.id || util.checkIfIsValidContext(req.body.context)) {
      next();
    } else {
      next(new Error(res.locals.__('widget.invalid.context')));
    }
  },
  renderVisibilityField: function renderVisibilityField(widget, context, req, res) {
    var field = '';

    // visibility field
    field += '<div class="form-group"><div class="row">' +
      '<label class="col-sm-4 control-label">'+
      res.locals.__('widget.visibility') + '</label>'+
    '<div class="col-sm-8"><select name="visibility" class="form-control">';

    field +=
    '<option value="in-context" selected>'+
      res.locals.__('widget.in-context')+
    '</option>'+
    '</select></div></div>'+
    '</div><hr>';

    return field;
  }
}

module.exports = util;