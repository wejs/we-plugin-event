window.addEventListener('WebComponentsReady', function() {
  var we = window.we;
  /**
   * Cflink client side logic.
   *
   * Show and hide advanced fields
   */
  var WeCfLinkFormPrototype = Object.create(HTMLElement.prototype);
  WeCfLinkFormPrototype.createdCallback = function createdCallback() {
    var self = this;

    if (!this.dataset.text) return console.warn('data-text is required for we-cflink-form');

    var btngroup = document.createElement('div');
    btngroup.classList.add('form-group');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add('btn');
    btn.classList.add('btn-default');
    btn.classList.add('btn-block');
    btn.textContent = this.dataset.text;

    btn.addEventListener('click',  function(){
      this.style.display = 'none';

      self.showFields();
    });

    this.hideFields();
    // show this component
    this.style.display = 'inherit';

    btngroup.appendChild(btn);

    this.children[0].insertBefore(btngroup, self.firstHiddenField);
  };

  WeCfLinkFormPrototype.advancedAttributes = [
    'class', 'style', 'target', 'rel', 'key', 'depth', 'weight', 'parent'
  ];

  /**
   * Hide advanced fields
   */
  WeCfLinkFormPrototype.hideFields = function hideFields() {
    var fields = this.children[0].children;

    for (var i = 0; i < fields.length; i++) {
      if (this.needHideField(fields[i].children[1])) {
        fields[i].style.display = 'none';

        if (!this.firstHiddenField) {
          this.firstHiddenField = fields[i];
        }

      }
    }
  };
  /**
   * Show advanced fields
   * @return {[type]} [description]
   */
  WeCfLinkFormPrototype.showFields = function showFields() {
    var fields = this.children[0].children;

    for (var i = 0; i < fields.length; i++) {
      if (this.needHideField(fields[i].children[1])) {
        fields[i].style.display = 'block';
      }
    }
  }

  /**
   * Check if this is one advanced field
   *
   * @param  {Object} field html field tag
   * @return {Boolean}
   */
  WeCfLinkFormPrototype.needHideField = function needHideField(field) {
    if ( field && field.name && this.advancedAttributes.indexOf(field.name) >-1 )
      return true;
    return false;
  }

  document.registerElement('we-cflink-form', {
    prototype: WeCfLinkFormPrototype
  });
});