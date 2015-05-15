var _ = require('lodash');
var toString = require('memory-to-string').default;

var defaultOptions = {
  moduleLoader: 'commonjs'
};

module.exports = function(Controller, options) {
  options = _.defaults(options, defaultOptions);
  var routes = Controller.getAllRoutes('express');
  var object = _.mapValues(routes, function(routeDetails, routeName) {
    var logic = Controller.getLogicFunction(routeDetails, Controller.prototype);
    routeDetails = _.omit(routeDetails, 'logic');
    var funcString = '(function() {\n' +
      'this._makeRequest(this._routeDetails[\'' + routeName + '\']' +
      ', arguments, \'' + Controller.modelName + '\', \'' + routeName + '\');\n' +
    '});';
    routeDetails.logic = eval(funcString);
    return routeDetails;
  });
  var prefix = '(function() {';
  var suffix = '\tmodule.exports = EZRoutes;\n})();';
  return toString(object, namespace, {prefix: prefix, suffix: suffix});
};
