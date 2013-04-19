'use strict';

var app = angular.module('lelylan.dashboards.devices.demo', ['lelylan.components.device']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/home', { templateUrl: '/partials/home-demo.html', controller: DashboardCtrl }).
    when('/all', { templateUrl: '/partials/devices.html', controller: DevicesCtrl }).
    otherwise({redirectTo: '/all'});
}]);
