'use strict'

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require)

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require
require = utils // eslint-disable-line no-undef, no-native-reassign

/**
 * Lazily required module dependencies
 */

require('compose-emitter', 'emitter')
require('eventemitter3', 'EventEmitter')
require('extend-shallow', 'extend')
require('is-typeof-error', 'isError')
require('sliced', 'slice')

/**
 * Restore `require`
 */

require = fn // eslint-disable-line no-undef, no-native-reassign

utils.iteratorFactory = function iteratorFactory (app, iterator) {
  return function () {
    var argz = utils.slice(arguments)
    var next = argz[argz.length - 1]
    argz[argz.length - 1] = done

    app.emit.apply(app, ['beforeEach'].concat(argz))
    iterator.apply(app, argz)

    function done (err, res) {
      var isError = utils.isError(err)
      if (!arguments.length || !isError) err = null
      app.emit.apply(app, ['afterEach', err, res].concat(argz))

      if (isError) {
        app.emit.apply(app, ['error', err, res].concat(argz))
        return app.options.settle ? next(null, err) : next(err)
      }
      next(err, res)
    }
  }
}

/**
 * Expose `utils` modules
 */

module.exports = utils
