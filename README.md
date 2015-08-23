# We.js conference plugin

[![Dependency Status](https://david-dm.org/wejs/we-plugin-conference.png)](https://david-dm.org/wejs/we-plugin-conference)
[![Build Status](https://travis-ci.org/wejs/we-plugin-conference.svg?branch=0.3.x)](https://travis-ci.org/wejs/we-plugin-conference)

## Requirements in your we.js project

- we-core
- we-plugin-menu
- we-plugin-form
- we-plugin-file

## Has suport to:

 - Add a muilti conference system in your we.js project

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
[![NPM](https://nodei.co/npm/we-plugin-conference.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/we-plugin-conference/)

## Copyright and license

Copyright 2013-2014 Alberto Souza <alberto.souza.dev@gmail.com> and contributors , under [the MIT license](LICENSE).
