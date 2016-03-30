/*!
 * async-simple-iterator <https://github.com/tunnckoCore/async-simple-iterator>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var base = require('./index')
var Ctor = require('./index').AsyncSimpleIterator
var ctrl = require('async')
var isEmitter = require('is-emitter')

var results = []
var values = []

function beforeEach (val) {
  values.push(val)
}
function afterEach (er, res) {
  results.push(res)
}

test('should throw TypeError if not function passed to `app.wrapIterator`', function (done) {
  function fixture () {
    base.wrapIterator(123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `iterator` to be function/)
  done()
})

test('should exposed constructor be signleton', function (done) {
  test.strictEqual(typeof Ctor === 'function', true)
  test.strictEqual(typeof Ctor() === 'object', true)
  done()
})

test('should be event emitter', function (done) {
  var app = new Ctor()
  test.strictEqual(isEmitter(base), true)
  test.strictEqual(isEmitter(app), true)
  done()
})

test('should be able to be used standalone', function (done) {
  var iterator = base.wrapIterator(function (val, next) {
    next(null, val)
  })
  iterator(123, function (err, res) {
    test.ifError(err)
    test.strictEqual(res, 123)
    done()
  })
})

test('should async.mapSeries be settled', function (done) {
  var iterator = base.wrapIterator(function (fn, next) {
    var res = null
    try {
      res = fn()
    } catch (e) {
      return next(e)
    }
    next(null, res)
  }, {
    settle: true,
    error: function (err) {
      test.ifError(!err)
    }
  })

  function throwError () {
    throw new Error('two err')
  }

  ctrl.mapSeries([
    function one () { return 1 },
    function two () {
      throwError()
      /* istanbul ignore next */
      return 2
    },
    function three () { return 3 }
  ], iterator, function (err, res) {
    test.strictEqual(err, null)
    test.strictEqual(res.length, 3)
    test.strictEqual(res[0], 1)
    test.strictEqual(res[2], 3)
    test.strictEqual(res[1] instanceof Error, true)
    test.strictEqual(res[1].message, 'two err')
    done()
  })
})

test('should emit beforeEach/afterEach events', function (done) {
  var app = new Ctor()
  app.on('beforeEach', beforeEach).on('afterEach', afterEach)

  var itarator = app.wrapIterator(function (val, next) {
    next(null, val + 123)
  })

  ctrl.mapSeries(['foo', 'bar', 'baz'], itarator, function (err, res) {
    test.ifError(err)
    test.deepEqual(res, ['foo123', 'bar123', 'baz123'])
    test.deepEqual(values, ['foo', 'bar', 'baz'])
    test.deepEqual(results, res)
    results = []
    values = []
    done()
  })
})

test('should be able to pass hooks through `options`', function (done) {
  var app = new Ctor({
    beforeEach: beforeEach
  })
  var itarator = app.wrapIterator(function (val, next) {
    next(null, val)
  }, {afterEach: afterEach})

  ctrl.mapSeries(['a', 'b', 'c'], itarator, function (err) {
    test.ifError(err)
    test.deepEqual(values, ['a', 'b', 'c'])
    test.deepEqual(results, values)
    done()
  })
})

test('should bind correct context (passed from constructor)', function (done) {
  var app = new Ctor({
    context: {a: 'b'},
    beforeEach: function (val) {
      test.deepEqual(this, {a: 'b', c: 'd'})
    }
  })
  // @todo
  // app.on('afterEach', function (val) {
  //     test.deepEqual(this, {a: 'b', c: 'd'})
  //     console.log('after')
  //   })
  var itarator = app.wrapIterator(function (val, next) {
    next(null, val)
  }, {context: {c: 'd'}})

  ctrl.mapSeries(['a', 'b', 'c'], itarator, function (err) {
    test.ifError(err)
    test.deepEqual(values, ['a', 'b', 'c'])
    test.deepEqual(results, values)
    done()
  })
})
