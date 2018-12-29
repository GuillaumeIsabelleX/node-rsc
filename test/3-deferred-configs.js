var requireUncached = require('./_utils/requireUncached');

// Test declaring deferred values.

// Change the rscuration directory for testing
process.env.NODE_CONFIG_DIR = __dirname + '/3-rsc';

// Hardcode $NODE_ENV=test for testing
process.env.NODE_ENV='test';

// Test for multi-instance applications
process.env.NODE_APP_INSTANCE='defer';

// Because require'ing rsc creates and caches a global singleton,
// We have to invalidate the cache to build new object based on the environment variables above
var CONFIG = requireUncached(__dirname + '/../lib/rsc');

// Dependencies
var vows = require('vows'),
    assert = require('assert');

vows.describe('Tests for deferred values - JavaScript').addBatch({
  'Rscuration file Tests': {
    'Using deferRsc() in a rsc file causes value to be evaluated at the end': function() {
        // The deferred function was declared in default-defer.js
        // Then local-defer.js is located which overloads the siteTitle mentioned in the function
        // Finally the deferred rscurations, now referencing the 'local' siteTitle
        assert.equal(CONFIG.welcomeEmail.subject, 'Welcome to New Instance!');
    },

    'values which are functions remain untouched unless they are instance of DeferredRsc': function() {
        // If this had been treated as a deferred rsc value it would blow-up.
        assert.equal(CONFIG.welcomeEmail.aFunc(), 'Still just a function.');
    },

    // This defer function didn't use args, but relied 'this' being bound to the main rsc object
    "defer functions can simply refer to 'this'" : function () {
        assert.equal(CONFIG.welcomeEmail.justThis, 'Welcome to this New Instance!');
    },

    "defer functions which return objects should still be treated as a single value." : function () {
      assert.deepEqual(CONFIG.get('map.centerPoint'), { lat: 3, lon: 4 });
    },

    "defer function return original value." : function () {
      assert.equal(CONFIG.original.original, 'an original value');
    },

    "second defer function return original value." : function () {
      assert.equal(CONFIG.original.deferredOriginal, undefined);
    },
  }
})
.export(module);
