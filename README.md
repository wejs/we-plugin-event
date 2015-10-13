# We.js full-featured events/conference portal plugin

> Install this plugin and get a full-featured evnets/conference portal We.js powered!

[![Dependency Status](https://david-dm.org/wejs/we-plugin-event.png)](https://david-dm.org/wejs/we-plugin-event)
[![Build Status](https://travis-ci.org/wejs/we-plugin-event.svg?branch=0.3.x)](https://travis-ci.org/wejs/we-plugin-event)

## Requirements in your we.js project

- we-core
- we-plugin-menu
- we-plugin-form
- we-plugin-file

## Has suport to:

 - Add a muilti event system in your we.js project

### How to test

after clone and install npm packages:

```sh
npm test
```

##### For run only 'Chat' test use:

```sh
NODE_ENV=test LOG_LV=info ./node_modules/.bin/mocha test/bootstrap.js test/**/*.test.js -g 'Chat'
```

##### For run the javascript linter

```sh
npm run lint
```

#### NPM Info:
[![NPM](https://nodei.co/npm/we-plugin-event.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/we-plugin-event/)

## License
[the MIT license](LICENSE).
