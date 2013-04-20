'use strict';

var app = angular.module('lelylan.dashboards.devices.demo', ['lelylan.components.device']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', { templateUrl: '/partials/home-demo.html', controller: DashboardCtrl }).
    when('/all', { templateUrl: '/partials/devices.html', controller: DevicesCtrl }).
    when('/categories/:category', { templateUrl: '/partials/devices.html', controller: CategoryCtrl }).
    otherwise({redirectTo: '/all'});
}]);
