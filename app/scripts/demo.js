'use strict';

var app = angular.module('lelylan.dashboards.devices.demo', ['lelylan.components.device']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', { templateUrl: 'views/home-demo.html', controller: DashboardCtrl }).
    when('/all', { templateUrl: 'views/devices.html', controller: DevicesCtrl }).
    when('/categories/:category', { templateUrl: 'views/devices.html', controller: CategoryCtrl }).
    otherwise({redirectTo: '/all'});
}]);
