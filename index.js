var _ = require('lodash');
var funcUtil = require('./func-details');
var toString = require('memory-to-string').default;

var defaultOptions = {
  moduleLoader: 'commonjs'
};

module.exports = function(Controller, options) {
  options = _.defaults(options, defaultOptions);
  var routes = Controller.getAllRoutes('express');
  var object = _.mapValues(routes, function(routeDetails, routeName) {
    var logic = Controller.getLogicFunction(routeDetails, Controller.prototype);
    routeDetails.args = funcUtil.extractArguments(logic);
    return _.omit(routeDetails, 'logic');
  });
  var prefix = '(function() {\n';
  var suffix = '\tmodule.exports = EZRoutes;\n})();';
  var namespace = 'var ' + Controller.modelName;
  return toString(object, namespace, {prefix: prefix, suffix: suffix});
};
