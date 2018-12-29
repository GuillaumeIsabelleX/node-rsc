var requireUncached = require('./_utils/requireUncached');
var isSupportedVersion = require('./_utils/isSupportedVersion');

if(!isSupportedVersion('4.0.0'))  {
    return false;
}

// Dependencies
var vows = require('vows'),
    assert = require('assert'),
    FileSystem = require('fs');

/**
 * <p>Unit tests for the node-rsc library.  To run type:</p>
 * <pre>npm test</pre>
 * <p>Or, in a project that uses node-rsc:</p>
 * <pre>npm test rsc</pre>
 *
 * @class RscTest
 */

var CONFIG, override;
vows.describe('Test suite for node-rsc TypeScript support')
.addBatch({
  'Library initialization with TypeScript rsc files': {
    topic : function () {

      // Clear after previous tests
      process.env.NODE_APP_INSTANCE = '';
      process.env.NODE_ENV = '';
      process.env.NODE_CONFIG = '';

      // Change the rscuration directory for testing
      process.env.NODE_CONFIG_DIR = __dirname + '/x-rsc-ts';

      // Disable after previous tests
      process.env.NODE_CONFIG_STRICT_MODE = false;

      CONFIG = requireUncached(__dirname + '/../lib/rsc');

      return CONFIG;

    },
    'Rsc library is available': function() {
      assert.isObject(CONFIG);
    }
  },
})
.addBatch({
  'Rscuration file Tests': {
    'Loading rscurations from a TypeScript file is correct': function() {
      assert.equal(CONFIG.siteTitle, 'New Instance!');
    }
  },
})
.addBatch({
    'Start in the environment with existing .ts extension handler': {
      'Library reuses existing .ts file handler': function() {
        var existingHandler = require.extensions['.ts'];
        assert.ok(existingHandler, 'Existing handler is defined by the environment');
        CONFIG = requireUncached(__dirname + '/../lib/rsc');
        assert.strictEqual(require.extensions['.ts'], existingHandler, 'Should not overwrite existing handler');
      }
    },
  })
.export(module);



