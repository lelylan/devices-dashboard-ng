'use strict';

var app = angular.module('lelylan.dashboards.devices', ['lelylan.components.type', 'lelylan.components.device']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', { templateUrl: '/partials/home.html', controller: DashboardCtrl }).
    when('/new', { templateUrl: '/partials/new-device.html', controller: CreateCtrl }).
    when('/all', { templateUrl: '/partials/devices.html', controller: DevicesCtrl }).
    when('/categories/:category', { templateUrl: '/partials/devices.html', controller: CategoryCtrl }).
    when('/types', { templateUrl: '/partials/types.html', controller: TypesCtrl }).
    otherwise({redirectTo: '/'});
}]);

// TODO move to an independent service
app.service( 'NewDevice', ['Device', function(Device) {
  var device;
  return {
    get: function() {
      if (!device) { device = new Device(); }
      return device;
    },
    set: function(_device) {
      if (!device) { device = new Device(); }
      angular.extend(device, _device);
      return device
    },
    reset: function(_device) {
      return device = null;
    }
  };
}])

