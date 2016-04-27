var assert = require('assert');
var sinon = require('sinon');
var helpers = require('we-test-tools').helpers;
var we, helper;

describe('helper_we-cf-menu', function () {

  before(function (done) {
    we = helpers.getWe();
    helper = require('../../server/helpers/we-cf-menu.js')(we, we.view);
    done();
  });

  it('helper should return an empty string if not have the menu', function (done) {

    var result = helper.bind({})(null, {
      hash: {}
    });

    assert.equal(result, '');

    done();
  });


  it('helper should return an empty menu if not have links', function (done) {
    var links = null;

    var result = helper.bind({})({
      links: links
    }, {
      hash: {}
    });

    assert.equal(result.string, '<ul></ul>');

    done();
  });

  it('helper should return menu html with menu links and sublinks', function (done) {
    var links = [
      {
        id: 1,
        eventId: 1,
        href: '/event/1/contact',
        text: 'cfcontact.link',
        title: 'cfcontact.link',
        class: 'link-contact'
      },
      {
        id: 2,
        eventId: 1,
        href: 'http://google.com',
        text: 'google',
        title: 'google search',
        class: 'link-google',
        links: [
          {
            id: 3,
            eventId: 1,
            href: '/event/1/cfnews',
            text: 'cfnews.link',
            title: 'cfnews.link',
            class: 'link-cfnews'
          }
        ]
      }
    ];

    var result = helper.bind({})({
      links: links,
      class: 'test-menu'
    }, {
      hash: {
        class: 'ttt1'
      }
    });

    assert.equal(result.string, '<ul class="ttt1 test-menu" ><li><a class="link-contact" '+
      'href="/event/1/contact">cfcontact.link</a></li><li><a class="link-google" '+
      'href="http://google.com">google</a></li><li><a class="link-cfnews" '+
      'href="/event/1/cfnews">cfnews.link</a></li></ul>');

    done();
  });
});