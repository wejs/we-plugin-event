# We.js full-featured events/conference portal plugin

> Install this plugin in your project to add a full-featured events/conference portal 
> We.js powered!

[![Dependency Status](https://david-dm.org/wejs/we-plugin-event.png)](https://david-dm.org/wejs/we-plugin-event)
[![Build Status](https://travis-ci.org/wejs/we-plugin-event.svg?branch=master)](https://travis-ci.org/wejs/we-plugin-event)
[![Coverage Status](https://coveralls.io/repos/github/wejs/we-plugin-event/badge.svg?branch=master)](https://coveralls.io/github/wejs/we-plugin-event?branch=master)

## Requirements in your project

- we-core
- we-plugin-menu
- we-plugin-form
- we-plugin-file
- we-plugin-vocabulary

## Installation:

In We.js project run:

```sh
npm install --save we-plugin-event we-plugin-menu we-plugin-form we-plugin-file
```

## Have suport to:

 - Add a event portal system in your we.js project
 - For see all features access http://events.wejs.org

## Hooks and events:

### Before send one event in findOne:

```js
plugin.hooks.on('we-plugin-event:before:send:event', function(data, next) {
    // data ==  {req: res, res: res}

    next();
});
```

### Before send admin index page:

```js
plugin.hooks.on('we-plugin-event:before:send:admin:index', function(data, next) {
    // data ==  {req: res, res: res}

    next();
});
```


### How to test

after clone and install npm packages:

```sh
npm test
```

#### Run tests with code coverage:

```sh
npm run coverage
```

##### For run only 'cfnewsFeature' test use:

```sh
we test -g 'event'
```

#### NPM Info:
[![NPM](https://nodei.co/npm/we-plugin-event.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/we-plugin-event/)

## License

[the MIT license](https://github.com/wejs/we-core/blob/master/LICENSE.md).
