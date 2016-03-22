# [async-simple-iterator][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> Making simple iterator for [async][] lib that adds beforeEach, afterEach, error hooks and support for settling. It also emits `beforeEach`, `afterEach` and `error` events.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

## Install
```
npm i async-simple-iterator --save
```

## Usage
> For more use-cases see the [tests](./test.js)

```js
var base = require('async-simple-iterator')
// or get constructor
var AsyncSimpleIterator = require('async-simple-iterator').AsyncSimpleIterator
```

### [AsyncSimpleIterator](index.js#L52)
> Initialize `AsyncSimpleIterator` with `options`.

**Params**

* `options` **{Object=}**: Pass `beforeEach`, `afterEach` and `error` hooks or `settle:true`.    

**Example**

```js
var ctrl = require('async')
var AsyncSimpleIterator = require('async-simple-iterator').AsyncSimpleIterator

var fs = require('fs')
var base = new AsyncSimpleIterator({
  settle: true,
  beforeEach: function (val) {
    console.log('before each:', val)
  },
  error: function (err, res, val) {
    console.log('on error:', val)
  }
})
var iterator = base.wrapIterator(fs.stat, {
  afterEach: function (err, res, val) {
    console.log('after each:', val)
  }
})

ctrl.map([
  'path/to/existing/file.js',
  'filepath/not/exist',
  'path/to/file'
], iterator, function (err, results) {
  // => `err` will always be null, if `settle:true`
  // => `results` is now an array of stats for each file
})
```

### [.wrapIterator](index.js#L136)
> Wraps `iterator` function which then can be passed to [async][] lib. You can pass returned iterator function to **every** [async][] method that you want.

**Params**

* `iterator` **{Function}**: Iterator to pass to [async][] lib.    
* `options` **{Object=}**: Pass `beforeEach`, `afterEach` and `error` hooks or `settle` option.    
* `returns` **{Function}**: Wrapped `iterator` function which can be passed to every [async][] method.  

**Events**
* `emits`: `beforeEach` with signature `val[, value], next`  
* `emits`: `afterEach` with signature `err, res, val[, value], next`  
* `emits`: `error` with signature `err, res, val[, value], next`  

**Example**

```js
var ctrl = require('async')
var base = require('async-simple-iterator')

base
  .on('afterEach', function (err, res, value, key, next) {
    console.log('after each:', err, res, value, key)
  })
  .on('error', function (err, res, value, key, next) {
    console.log('on error:', err, res, value, key)
  })

var iterator = base.wrapIterator(function (value, key, next) {
  console.log('actual:', value, key)

  if (key === 'dev') {
     var err = new Error('err:' + key)
     err.value = value
     next(err)
     return
   }
   next(null, 123 + key + 456)

}, {
  settle: true,
  beforeEach: function (value, key, next) {
    console.log('before each:', value, key)
  }
})

ctrl.forEachOf({
  dev: './dev.json',
  test: './test.json',
  prod: './prod.json'
}, iterator, function done (err) {
  // if settle:false, `err`
  // if settle:true, `null`
  console.log('end:', err)
})
```

## Related
* [async](https://www.npmjs.com/package/async): Higher-order functions and common patterns for asynchronous code | [homepage](https://github.com/caolan/async)
* [async-base-iterator](https://www.npmjs.com/package/async-base-iterator): Basic iterator for [async][] library that handles async and synchronous… [more](https://www.npmjs.com/package/async-base-iterator) | [homepage](https://github.com/tunnckocore/async-base-iterator)
* [async-control](https://www.npmjs.com/package/async-control): Ultimate asynchronous control flow goodness with built-in hook system and… [more](https://www.npmjs.com/package/async-control) | [homepage](https://github.com/hybridables/async-control)
* [relike](https://www.npmjs.com/package/relike): Simple promisify a callback-style function with sane defaults. Support promisify-ing… [more](https://www.npmjs.com/package/relike) | [homepage](https://github.com/hybridables/relike)

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/async-simple-iterator/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckoCore.tk][author-www-img]][author-www-url] [![keybase tunnckoCore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]

[async]: https://github.com/caolan/async
[is-typeof-error]: https://github.com/tunnckocore/is-typeof-error

[npmjs-url]: https://www.npmjs.com/package/async-simple-iterator
[npmjs-img]: https://img.shields.io/npm/v/async-simple-iterator.svg?label=async-simple-iterator

[license-url]: https://github.com/tunnckoCore/async-simple-iterator/blob/master/LICENSE
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg

[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/async-simple-iterator
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/async-simple-iterator.svg

[travis-url]: https://travis-ci.org/tunnckoCore/async-simple-iterator
[travis-img]: https://img.shields.io/travis/tunnckoCore/async-simple-iterator/master.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/async-simple-iterator
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/async-simple-iterator.svg

[david-url]: https://david-dm.org/tunnckoCore/async-simple-iterator
[david-img]: https://img.shields.io/david/tunnckoCore/async-simple-iterator.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg

