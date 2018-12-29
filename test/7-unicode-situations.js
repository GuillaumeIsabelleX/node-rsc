var requireUncached = require('./_utils/requireUncached');

// Dependencies
var vows = require('vows'),
    assert = require('assert'),
        path = require('path');

// Change the rscuration directory for testing
process.env.NODE_CONFIG_DIR = __dirname + '/7-rsc';

// Hardcode $NODE_ENV=test for testing
delete process.env.NODE_ENV;

// Test for multi-instance applications
delete process.env.NODE_APP_INSTANCE;

process.env.NODE_CONFIG_STRICT_MODE = false;

var CONFIG = requireUncached(__dirname + '/../lib/rsc');


vows.describe('Tests for Unicode situations')
.addBatch({
    'Parsing of BOM related files': {
        'A standard rsc file having no BOM should continue to parse without error': function () {

            var result = null,
                standardNoBomRscFile = process.env.NODE_CONFIG_DIR + path.sep + 'defaultNoBOM.json';

            assert.doesNotThrow(function () {
                result = CONFIG.util.parseFile(standardNoBomRscFile);
            }, 'standard rsc file with no BOM has a parse error');

        },
        'A rsc file with a BOM should parse without error': function () {

            var result = null,
                rscFileWithBom = process.env.NODE_CONFIG_DIR + path.sep + 'defaultWithUnicodeBOM.json';

            assert.doesNotThrow(function () {
                result = CONFIG.util.parseFile(rscFileWithBom);
            }, 'rsc file with BOM has a parse error');

        }
    }
})
.export(module);
