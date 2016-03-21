/*!
 * async-simple-iterator <https://github.com/tunnckoCore/async-simple-iterator>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

/**
 * > Initialize `AsyncSimpleIterator` with `options`.
 *
 * **Example**
 *
 * ```js
 * var ctrl = require('async')
 * var AsyncSimpleIterator = require('async-simple-iterator').AsyncSimpleIterator
 * var base = new AsyncSimpleIterator({ settle: true })
 *
 * base.on('beforeEach', function (val) {
 *   console.log('before each:', val)
 * })
 * base.on('afterEach', function (err, res, val) {
 *   console.log('after each:', err, res, val)
 * })
 * base.on('error', function (err, res, val) {
 *   console.log('on error:', err, res, val)
 * })
 * ```
 *
 * @param {Object=} `options` Pass `beforeEach`, `afterEach` and `error` hooks or `settle:true`.
 * @api public
 */
function AsyncSimpleIterator (options) {
  if (!(this instanceof AsyncSimpleIterator)) {
    return new AsyncSimpleIterator(options)
  }
  this.defaultOptions(options)
  utils.Emitter(this)
}

/**
 * > Setting default options. Default `settle` option is `false`.
 *
 * @param  {Object=} `options` Pass `beforeEach`, `afterEach` and `error` hooks or `settle:true`.
 * @return {Object} `AsyncSimpleIterator` instance for chaining.
 * @api private
 */

AsyncSimpleIterator.prototype.defaultOptions = function defaultOptions (options) {
  options = utils.extend({settle: false}, this.options, options)
  options.settle = typeof options.settle === 'boolean' ? !!options.settle : false
  this.options = options
  return this
}

/**
 * > Wraps `iterator` function which then can be passed to [async][] lib.
 *
 * **Example**
 *
 * ```js
 * var ctrl = require('async')
 * var base = require('async-simple-iterator')
 * ```
 *
 * @emit  `beforeEach` with signature `val[, value], next`
 * @emit  `afterEach` with signature `err, res, val[, value], next`
 * @emit  `error` with signature `err, res, val[, value], next`
 *
 * @param  {Function} `iterator` Iterator to pass to [async][] lib.
 * @param  {Object=} `options` Pass `beforeEach`, `afterEach` and `error` hooks or `settle` option.
 * @return {Function} Wrapped `iterator` function which is passed to [async][].
 * @api public
 */

AsyncSimpleIterator.prototype.wrapIterator = function wrapIterator (iterator, options) {
  if (typeof iterator !== 'function') {
    throw new TypeError('async-simple-iterator: expect `iterator` to be function')
  }
  this.options = options ? utils.extend(this.options, options) : this.options

  if (typeof this.options.beforeEach === 'function') {
    this.on('beforeEach', this.options.beforeEach)
  }
  if (typeof this.options.afterEach === 'function') {
    this.on('afterEach', this.options.afterEach)
  }
  if (typeof this.options.error === 'function') {
    this.on('error', this.options.error)
  }

  return utils.iteratorFactory(this, iterator)
}

/**
 * Expose `AsyncSimpleIterator` instance
 *
 * @type {Object}
 * @api private
 */

module.exports = new AsyncSimpleIterator()

/**
 * Expose `AsyncSimpleIterator` constructor
 *
 * @type {Function}
 * @api private
 */

module.exports.AsyncSimpleIterator = AsyncSimpleIterator
