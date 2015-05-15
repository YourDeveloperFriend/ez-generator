var _ = require('lodash');
var funcUtil = require('./func-details');
var ExpressHandler = require('ez-express');
var toString = require('memory-to-string').default;
console.log(ExpressHandler);

var defaultOptions = {
  moduleLoader: 'commonjs'
};

module.exports = function(Controller, options) {
  options = _.defaults(options, defaultOptions);
  var routes = Controller.getAllRoutes('express');
  var object = _.mapValues(routes, function(routeDetails, routeName) {
    var logic = Controller.getLogicFunction(routeDetails, Controller.prototype);
    routeDetails = _.omit(routeDetails, 'logic');
    var routeInfo = ExpressHandler.getRoutingInfo(Controller, routeName, routeDetails);
    _.assign(routeDetails, _.pick(routeInfo, 'pathPattern', 'method'));
    routeDetails.args = funcUtil.extractArguments(logic);
    return routeDetails;
  });
  if(Object.keys(object).length === 0) {
    return false;
  }
  object.tableName = Controller.tableName;
  var prefix = '(function() {\n';
  var suffix = '\tmodule.exports = ' + Controller.modelName + ';\n})();';
  var namespace = 'var ' + Controller.modelName;
  return toString(object, namespace, {prefix: prefix, suffix: suffix});
};
