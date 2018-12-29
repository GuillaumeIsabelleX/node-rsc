
// Tests for rsc.util functions

// Dependencies
var vows = require('vows'),
    assert = require('assert'),
    path = require('path'),
    rsc = require('../lib/rsc'),
    initParam = rsc.util.initParam,
    loadFileRscs = rsc.util.loadFileRscs;

vows.describe('Tests for rsc util functions')
.addBatch({
    'Tests for util.initParam': {
        'When no command line or env var is set, default value is returned.': function () {
          assert(initParam('EMPTY','mydefault'),'mydefault');
        },
        'When process.env is set and cmdline is not, process.env is used ': function () {
          process.env.ENV_ONLY = 'in-the-env';
          assert(initParam('ENV_ONLY','mydefault'),'in-the-env');
        },
        'When process.env is set and cmdline *is* set, cmd-line is used ': function () {
          process.env.BOTH = 'in-the-env';
          process.argv=['--BOTH=in-the-argv'];
          assert(initParam('BOTH','mydefault'),'in-the-argv');
        },
        'After calling initParam, value is reflected in getEnv() even if it did not come from process.env': function () {
          process.argv=['ignore','ignore','--FROMARG=in-the-argv'];
          assert(initParam('FROMARG','mydefault'),'in-the-argv');
          assert(rsc.util.getEnv('FROMARG'),'in-the-argv');
        },
        'Setting a zero value in the process.env works (process.env inherently casts values to strings)': function () {
          process.env.ENV_ONLY = '0';
          assert.strictEqual(initParam('ENV_ONLY','mydefault'),'0');
        },
        'Setting a zero value on the command line works. ': function () {
          process.argv=['ignore','ignore','--FROMARG=0'];
          assert.strictEqual(initParam('FROMARG','mydefault'),'0');
        },
    },
    'Tests for util.loadFileRscs': {
        'It can load data from a given directory': function () {
          var result = loadFileRscs(path.join(__dirname, '5-rsc'));
          assert.strictEqual(result.number, 5);
        },
        'It ignores NODE_CONFIG when loading from directory': function () {
          var prev = process.env.NODE_CONFIG;
          process.env.NODE_CONFIG = '{"number":4}'
          var result = loadFileRscs(path.join(__dirname, '5-rsc'));
          assert.strictEqual(result.number, 5);
          process.env.NODE_CONFIG = prev;
        },
    }
})
.export(module);

