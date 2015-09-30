module.exports = {
  /**
   * Get event if from widget or response
   *
   * @param  {Object} widget
   * @param  {Object} res
   * @return {Number}
   */
  getEventIdFromWidget: function getEventIdFromWidget(widget, res) {
    if (res && res.locals.event) {
      return res.locals.event.id;
    } else {
      var ctx = widget.dataValues.context.split('-');
      if ( (ctx[0] == 'event') && ctx[1] && Number(ctx[1]) )
        return ctx[1];
    }
    // default is null
    return null;
  }
};