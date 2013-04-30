'use strict';

var app = angular.module('lelylan.dashboards.devices', [
  'lelylan.components.type',
  'lelylan.components.device'
]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/home', { templateUrl: 'views/home.html', controller: DashboardCtrl }).
    when('/new', { templateUrl: 'views/new-device.html', controller: CreateCtrl }).
    when('/learn', { templateUrl: 'views/learn.html', controller: DashboardCtrl }).
    when('/all', { templateUrl: 'views/devices.html', controller: DevicesCtrl }).
    when('/categories/:category', { templateUrl: 'views/devices.html', controller: CategoryCtrl }).
    when('/types/:typeId', { templateUrl: 'views/type.html',  controller: TypeCtrl }).
    when('/types', { templateUrl: 'views/types.html', controller: TypesCtrl }).
    otherwise({redirectTo: '/all'});
}]);

app.service( 'NewDevice', ['Device', function(Device) {
  var device;

  return {
    get:   function()        { if (!device) { device = new Device(); }; return device; },
    set:   function(_device) { if (!device) { device = new Device(); }; angular.extend(device, _device); return device },
    reset: function()        { return device = null; }
  };
}])

