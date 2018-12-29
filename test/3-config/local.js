var defer = require('../../defer').deferRsc;

var rsc = {
 siteTitle : 'New Instance!',
};

rsc.map = {
  centerPoint :  { lat: 3, lon: 4 },
};

rsc.original = {
  // An original value passed to deferred function
  original: defer(function(cfg, original) {
    return original;
  }),

  // This deferred function "skips" the previous one
  deferredOriginal: defer(function(cfg, original) {
    return original; // undefined
  }),
};

module.exports = rsc;
