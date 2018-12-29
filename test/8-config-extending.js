var requireUncached = require('./_utils/requireUncached');

// Dependencies
var vows = require('vows'),
    assert = require('assert'),
        path = require('path');

// Change the rscuration directory for testing
process.env.NODE_CONFIG_DIR = __dirname + '/8-rsc';

// Hardcode $NODE_ENV=test for testing
delete process.env.NODE_ENV;

// Test for multi-instance applications
delete process.env.NODE_APP_INSTANCE;

process.env.NODE_CONFIG_STRICT_MODE = false;

var CONFIG = requireUncached(__dirname + '/../lib/rsc');


vows.describe('Tests for rsc extending')
.addBatch({
    'Extending a base rscuration with another rscuration': {
        'Extending a rscuration with another rscuration should work without error': function () {

            process.env.NODE_CONFIG_DIR = __dirname + '/8-rsc';
            var base_rsc = require(process.env.NODE_CONFIG_DIR + path.sep + 'base-rsc.json');
            CONFIG.util.attachProtoDeep(base_rsc);

            assert.doesNotThrow(function () {
                result = CONFIG.util.extendDeep(base_rsc, CONFIG);
            }, 'Extending a rscuration with another rscuration has an error');

        }
    }
})
.export(module);