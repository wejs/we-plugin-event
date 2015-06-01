App.Router.map(function() {
  this.resource('wejsdocs',{ path: '/docs'}, function() {
    this.resource('wejsdoc',{path: '/:project'}, function() {
      this.route('dpage', {path: '/:page'})
    });
  });
});

App.WejsdocsIndexRoute = Ember.Route.extend(App.ResetScrollMixin, {
  model: function (params) {
    return Ember.RSVP.hash({
      projects: $.get('/docs-projects')
    });
  }
});

App.WejsdocRoute = Ember.Route.extend(App.ResetScrollMixin, {
  model: function (params) {
    var url = '/docs/'+ params.project;
    if (params.page) {
      url = '/docs/'+ params.project + '/' + params.page
    }

    return Ember.RSVP.hash({
      project: $.get(url)
    });
  }
});

App.WejsdocDpageRoute = Ember.Route.extend(App.ResetScrollMixin, {
  model: function (params) {
    var url = '/docs/'+ params.project;
    if (params.page) {
      url = '/docs/'+ this.modelFor('wejsdoc').project.projectName + '/' + params.page
    }

    return Ember.RSVP.hash({
      project: $.get(url)
    });
  }
});