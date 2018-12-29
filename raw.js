/**
 * This is meant to wrap rscuration objects that should be left as is,
 * meaning that the object or its protoype will not be modified in any way
 */
function RawRsc () {
}

function raw(rawObj) {
  var obj = Object.create(RawRsc.prototype);
  obj.resolve = function () { return rawObj; }
  return obj;
}

module.exports.RawRsc = RawRsc;
module.exports.raw = raw;
