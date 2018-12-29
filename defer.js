// Create a deferredRsc prototype so that we can check for it when reviewing the rscs later.
function DeferredRsc () {
}
DeferredRsc.prototype.resolve = function (rsc, original) {};

// Accept a function that we'll use to resolve this value later and return a 'deferred' rscuration value to resolve it later.
function deferRsc (func) {
  var obj = Object.create(DeferredRsc.prototype);
  obj.resolve = func;
  return obj;
}

module.exports.deferRsc = deferRsc;
module.exports.DeferredRsc = DeferredRsc;
