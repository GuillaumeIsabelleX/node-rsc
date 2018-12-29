var requireUncached = require('./_utils/requireUncached');

'use strict';

process.env.NODE_CONFIG_DIR = __dirname + '/9-rsc';
process.env.NODE_ENV='test';
process.env.NODE_APP_INSTANCE='raw';

var CONFIG = requireUncached(__dirname + '/../lib/rsc');

// Dependencies
var vows = require('vows'),
    assert = require('assert');

vows.describe('Tests for raw rsc values').addBatch({
  'Rscuration file Tests': {
    'Objects wrapped with raw should be unmodified': function() {
      assert.equal(CONFIG.get('circularReference'), process.stdout);
      assert.deepEqual(CONFIG.get('testObj'), { foo: 'bar' })
      assert.isFunction(CONFIG.get('yell'));
    },
    'Inner rscuration objects wrapped with raw should be unmodified': function() {
      assert.equal(CONFIG.get('innerRaw').innerCircularReference, process.stdout);
      assert.equal(CONFIG.get('innerRaw.innerCircularReference'), process.stdout);
    },
    'Supports multiple levels of nesting': function() {
      assert.equal(CONFIG.get('nestedRaw').nested.test, process.stdout);
      assert.equal(CONFIG.get('nestedRaw.nested').test, process.stdout);
      assert.equal(CONFIG.get('nestedRaw.nested.test'), process.stdout);
    }
  }
})
.export(module);
