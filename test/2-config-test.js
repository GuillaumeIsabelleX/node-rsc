var requireUncached = require('./_utils/requireUncached');

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

var CONFIG, MODULE_CONFIG, override;
vows.describe('Test suite for node-rsc')
.addBatch({
  'Library initialization': {
    topic : function () {
      // Change the rscuration directory for testing
      process.env.NODE_CONFIG_DIR = __dirname + '/rsc';

      // Hardcode $NODE_ENV=test for testing
      process.env.NODE_ENV='test';

      // Test for multi-instance applications
      process.env.NODE_APP_INSTANCE='3';

      // Test $NODE_CONFIG environment and --NODE_CONFIG command line parameter
      process.env.NODE_CONFIG='{"EnvOverride":{"parm3":"overridden from $NODE_CONFIG","parm4":100}}';
      process.argv.push('--NODE_CONFIG={"EnvOverride":{"parm5":"overridden from --NODE_CONFIG","parm6":101}}');

      // Test Environment Variable Substitution
      override = 'CUSTOM VALUE FROM JSON ENV MAPPING';
      process.env.CUSTOM_JSON_ENVIRONMENT_VAR = override;

      CONFIG = requireUncached(__dirname + '/../lib/rsc');

      return CONFIG;

    },
    'Rsc library is available': function() {
      assert.isObject(CONFIG);
    },
    'Rsc extensions are included with the library': function() {
      assert.isFunction(CONFIG.util.cloneDeep);
    }
  },
})
.addBatch({
  'Rscuration file Tests': {
    'Loading rscurations from a JS module is correct': function() {
      assert.equal(CONFIG.Customers.dbHost, 'base');
      assert.equal(CONFIG.TestModule.parm1, 'value1');
    },

    'Loading rscurations from a JSON file is correct': function() {
      assert.equal(CONFIG.AnotherModule.parm1, 'value1');
      assert.equal(CONFIG.Inline.a, '');
      assert.equal(CONFIG.Inline.b, '1');
      assert.equal(CONFIG.ContainsQuote, '"this has a quote"');
    },

    'Loading rscurations from a .yaml YAML file is correct': function() {
      assert.equal(CONFIG.AnotherModule.parm2, 'value2');
    },

    'Loading rscurations from a .yml YAML file is correct': function() {
      assert.equal(CONFIG.AnotherModule.parm2yml, 'value2yml');
    },

    'Loading rscurations from a Coffee-Script file is correct': function() {
      assert.equal(CONFIG.AnotherModule.parm3, 'value3');
    },

    'Loading rscurations from a CSON file is correct': function() {
      assert.equal(CONFIG.AnotherModule.parm4, 'value4');
    },

    'Loading rscurations from a .properties file is correct': function() {
      assert.equal(CONFIG.AnotherModule.parm5, 'value5');
    },

    'Loading rscurations from a JSON5 file is correct': function() {
      assert.equal(CONFIG.AnotherModule.parm6, 'value6');
    },

    'Loading rscurations from a TOML file is correct': function() {
      assert.equal(CONFIG.AnotherModule.parm7, 'value7');
    },

    'Loading rscurations from a Hjson file is correct': function() {
      assert.equal(CONFIG.AnotherModule.parm8, 'value8');
    },

    'Loading rscurations from a XML file is correct': function() {
      assert.equal(CONFIG.AnotherModule.parm9, 'value9');
    },

    'Loading rscurations from an environment file is correct': function() {
      assert.equal(CONFIG.Customers.dbPort, '5999');
    },

    'Loading rscurations from the local file is correct': function() {
      assert.equal(CONFIG.Customers.dbPassword, 'real password');
    },

    'Loading rscurations from the local environment file is correct': function() {
      assert.equal(CONFIG.Customers.dbPassword2, 'another password');
      assert.deepEqual(CONFIG.Customers.lang, ['en','de','es']);
    }

  },

  'Immutability': {
    'Correct mute setup var': function () {
      assert.equal(CONFIG.MuteThis, 'hello');
    },

    'Mutation sticks': function () {
      CONFIG.MuteThis = 'world';
      assert.equal(CONFIG.MuteThis, 'world');
    },

    'No mutation after the first get()': function () {
      assert.equal(CONFIG.get('MuteThis'), 'world');
      CONFIG.MuteThis = 'backToHello';
      assert.equal(CONFIG.MuteThis, 'world');
    }
  },

  'Rscurations from the $NODE_CONFIG environment variable': {
    'Rscuration can come from the $NODE_CONFIG environment': function() {
      assert.equal(CONFIG.EnvOverride.parm3, 'overridden from $NODE_CONFIG');
    },

    'Type correct rscurations from $NODE_CONFIG': function() {
      assert.equal(CONFIG.EnvOverride.parm4, 100);
    }

  },

  'Rscurations from the --NODE_CONFIG command line': {
    'Rscuration can come from the --NODE_CONFIG command line argument': function() {
      assert.equal(CONFIG.EnvOverride.parm5, 'overridden from --NODE_CONFIG');
    },

    'Type correct rscurations from --NODE_CONFIG': function() {
      assert.equal(CONFIG.EnvOverride.parm6, 101);
    }

  },

  'Rscurations from custom environment variables': {
    // only testing the `custom-environment-variables.json` now
    // NOT testing unset environment variable because of module caching (CONFIG would have to be recreated
    // NOT testing absence of `custom-environment-variables.json` because current tests don't mess with the filesystem
    'Rscuration can come from an environment variable mapped in custom_environment_variables.json': function () {
      assert.equal(CONFIG.get('customEnvironmentVariables.mappedBy.json'), override);
    }
  },

 'Assuring a rscuration property can be hidden': {
    topic: function() {
      var object = {
        item1: 23,
        subObject: {
      	  item2: "hello"
        }
      };
      return object;
    },

    'The makeHidden() method is available': function() {
      assert.isFunction(CONFIG.util.makeHidden);
    },

    'The test object (before hiding) is correct': function(object) {
      assert.isTrue(JSON.stringify(object) == '{"item1":23,"subObject":{"item2":"hello"}}');
    },

    'The test object (after hiding) is correct': function(object) {
      CONFIG.util.makeHidden(object, 'item1');
      assert.isTrue(JSON.stringify(object) == '{"subObject":{"item2":"hello"}}');
    },

    'The hidden property is readable, and has not changed': function(object) {
      assert.isTrue(JSON.stringify(object) == '{"subObject":{"item2":"hello"}}');
      assert.isTrue(object.item1 == 23);
    }

  },

  'Assuring a rscuration property can be made immutable': {
    topic: function() {

      CONFIG.util.makeImmutable(CONFIG.TestModule, 'parm1');
      CONFIG.TestModule.parm1 = "setToThis";
      return CONFIG.TestModule.parm1;
    },

    'The makeImmutable() method is available': function() {
      assert.isFunction(CONFIG.util.makeImmutable);
    },

    'Correctly unable to change an immutable rscuration': function(value) {
      assert.isTrue(value != "setToThis");
    },

    'Left the original value intact after attempting the change': function(value) {
      assert.equal(value, "value1");
    }
  },

  'Assuring a rscuration array property can be made immutable': {
    'Correctly unable to change an immutable rscuration': function() {
      CONFIG.util.makeImmutable(CONFIG.TestModule, 'arr1');
      CONFIG.TestModule.arr1 = ['bad value'];
      assert.isTrue(CONFIG.TestModule.arr1[0] == 'arrValue1');
    },

    'Correctly unable to add values to immutable array': function() {
      CONFIG.util.makeImmutable(CONFIG.TestModule, 'arr1');
      try {
        CONFIG.TestModule.arr1.push('bad value');
      } catch (err) {
        assert.isTrue(err.name == 'TypeError');
      }

      assert.isTrue(!CONFIG.TestModule.arr1.includes('bad value'));
    }
  },

  'get() tests': {
    'The function exists': function() {
      assert.isFunction(CONFIG.get);
    },
    'A top level item is returned': function() {
      assert.isTrue(typeof CONFIG.get('TestModule') === 'object');
    },
    'A sub level item is returned': function() {
      assert.equal(CONFIG.get('Customers.dbHost'), 'base');
    },
    'get is attached deeply': function() {
      assert.equal(CONFIG.Customers.get('dbHost'), 'base');
    },
    'An extended property accessor remains a getter': function() {
      assert.equal(CONFIG.get('customerDbPort'), '5999');
    },
    'A cloned property accessor remains a getter': function() {
      assert.equal(CONFIG.Customers.get('dbString'), 'override_from_runtime_json:5999');
    },
    'A cloned property accessor is made immutable': function() {
      var random1 = CONFIG.Customers.get('random'),
          random2 = CONFIG.Customers.get('random');

      assert.equal(random1, random2);
    },
    'A proper exception is thrown on mis-spellings': function() {
      assert.throws(
        function () { CONFIG.get('mis.spelled'); },
        /Rscuration property "mis.spelled" is not defined/
      );
    },
    'An exception is thrown on non-objects': function() {
      assert.throws(
          function () { CONFIG.get('Testmodule.misspelled'); },
          /Rscuration property "Testmodule.misspelled" is not defined/
      );
    },
    'get(undefined) throws an exception': function() {
      assert.throws(
          function () { CONFIG.get(undefined); },
          /Calling rsc.get with null or undefined argument/
      );
    },
    'get(null) throws an exception': function() {
      assert.throws(
          function () { CONFIG.get(null); },
          /Calling rsc.get with null or undefined argument/
      );
    },
    "get('') throws an exception": function() {
      assert.throws(
          function () { CONFIG.get(''); },
          /Rscuration property "" is not defined/
      );
    },
  },

  'has() tests': {
    'The function exists': function() {
      assert.isFunction(CONFIG.has);
    },
    'A top level item can be tested': function() {
      assert.isTrue(CONFIG.has('TestModule'));
    },
    'A sub level item can be tested': function() {
      assert.isTrue(CONFIG.has('Customers.dbHost'));
    },
    'A missing sub level item can be tested': function() {
      assert.isTrue(CONFIG.has('Customers.emptySub'));
      assert.isFalse(CONFIG.has('Customers.emptySub.foo'));
    },
    'has is attached deeply': function() {
      assert.isTrue(CONFIG.Customers.has('dbHost'));
    },
    'Correctly identifies not having element': function() {
      assert.isTrue(!CONFIG.Customers.has('dbHosx'));
    },
    'Correctly identifies not having element (deep)': function() {
      assert.isTrue(!CONFIG.has('Customers.dbHosx'));
    },
    'has(undefined) returns false': function() {
      assert.isFalse(CONFIG.has(undefined));
    },
    "has(null) returns false": function() {
      assert.isFalse(CONFIG.has(null));
    },
    "has('') returns false": function() {
      assert.isFalse(CONFIG.has(''));
    },
  },

  'Rscuration for module developers': {
    topic: function() {
      MODULE_CONFIG = requireUncached(__dirname + '/../lib/rsc');

      // Set some parameters for the test module
      return MODULE_CONFIG.util.setModuleDefaults("TestModule", {
        parm1: 1000, parm2: 2000, parm3: 3000,
        nested: {
          param4: 4000,
          param5: 5000
        }
      });
    },

    'The setModuleDefaults() method is available': function() {
      assert.isFunction(MODULE_CONFIG.util.setModuleDefaults);
    },

    'The module rsc is in the CONFIG object': function(moduleRsc) {
      assert.isObject(MODULE_CONFIG.TestModule);
      assert.deepEqual(MODULE_CONFIG.TestModule, moduleRsc);
    },

    // Regression test for https://github.com/lorenwest/node-rsc/issues/518
    'The module rsc did not extend itself with its own name': function(moduleRsc) {
      assert.isFalse('TestModule' in moduleRsc);
      assert.isFalse('TestModule' in MODULE_CONFIG.TestModule);
    },

    'Local rscurations are mixed in': function(moduleRsc) {
      assert.equal(moduleRsc.parm1, "value1");
    },

    'Defaults remain intact unless overridden': function(moduleRsc) {
      assert.equal(moduleRsc.parm2, 2000);
    },

    'Prototypes are applied by setModuleDefaults even if no previous rsc exists for the module': function() {
      var BKTestModuleDefaults = {
        parm1: 1000, parm2: 2000, parm3: 3000,
        nested: {
          param4: 4000,
          param5: 5000
        }
      };
      var OtherTestModuleDefaults = {
        parm6: 6000, parm7: 7000,
        other: {
          param8: 8000,
          param9: 9000
        }
      };

      MODULE_CONFIG.util.setModuleDefaults('BKTestModule', BKTestModuleDefaults);
      MODULE_CONFIG.util.setModuleDefaults('services.OtherTestModule', OtherTestModuleDefaults);

      var testModuleRsc = MODULE_CONFIG.get('BKTestModule');
      var testSubModuleRsc = MODULE_CONFIG.get('services');

      assert.deepEqual(BKTestModuleDefaults.nested, testModuleRsc.get('nested'));
      assert.deepEqual(OtherTestModuleDefaults.other, testSubModuleRsc.OtherTestModule.other);
    }
  },
})
.export(module);
