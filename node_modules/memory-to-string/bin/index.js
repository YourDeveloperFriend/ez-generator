"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

exports = module.exports = convertToFrontEnd;
exports.convertToFrontEndRaw = convertToFrontEndRaw;
var _ = _interopRequire(require("lodash"));

var getTabs = exports.getTabs = _.memoize(function (depth) {
  return _.times(depth, function () {
    return "  ";
  }).join("");
});

function convertToFrontEnd(object, namespace, options) {
  options = options || {};
  var output = [options.prefix || ""];
  output.push("" + namespace + " = " + convertToFrontEndRaw(object) + ";\n");
  output.push(options.suffix || "");
  return output.join("");
}function convertToFrontEndRaw(object) {
  var depth = arguments[1] === undefined ? 0 : arguments[1];
  var tabs = getTabs(depth);
  var tabs2 = getTabs(depth + 1);
  var output;
  if (_.isFunction(object)) {
    output = object.toString().replace(/\n\s*/mg, "\n" + tabs2);
    var lastNewLine = output.lastIndexOf("\n");
    return output.substring(0, lastNewLine) + output.substring(lastNewLine).replace(/\n\s*/m, "\n" + tabs);
  } else if (_.isArray(object)) {
    output = "[\n";
    var parts = [];
    for (var _iterator = object[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      var object_item = _step.value;
      parts.push(convertToFrontEndRaw(object_item, depth + 1));
    }

    output += tabs2 + parts.join(",\n" + tabs2) + "\n";
    return output + tabs + "]";
  } else if (_.isObject(object)) {
    output = "{\n";
    var parts = [];
    for (var field in object) {
      parts.push(field + ": " + convertToFrontEndRaw(object[field], depth + 1));
    }
    output += tabs2 + parts.join(",\n" + tabs2) + "\n";
    return output + tabs + "}";
  } else if (_.isNumber(object) || _.isBoolean(object)) {
    return "" + object;
  } else if (_.isString(object)) {
    return "'" + object.replace("\"", "\\\"").replace("'", "\\'") + "'";
  } else {
    return "undefined";
  }
};

