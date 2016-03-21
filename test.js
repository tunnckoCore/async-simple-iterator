/*!
 * async-simple-iterator <https://github.com/tunnckoCore/async-simple-iterator>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var ctrl = require('async')
var test = require('assertit')
var base = require('./index')

test('async-simple-iterator:', function () {
  var obj = {
    dev: './dev.json',
    test: './test.json',
    prod: './prod.json'
  }
  var iterator = base.wrapIterator(function (val, key, next) {
    console.log('actual:', val, key)

    if (key === 'dev') {
      var err = new Error('foo:' + key)
      err.value = val
      next(err)
      return
    }

    next(null, 123 + key + 456)
  }, {settle: true})

  base
    .on('beforeEach', function (val, key, next) {
      console.log('beforeEach:', val, key)
    })
    .on('afterEach', function (err, res, val, key, next) {
      console.log('afterEach:', err, res, val, key)
    })
    .on('error', function (err, res, val, key, next) {
      console.log('error:', err, res, val, key)
    })

  ctrl.forEachOf(obj, iterator, function (err) {
    // if settle:false, `err`
    // if settle:true, `null`
    console.log('end:', err)
  })
})
