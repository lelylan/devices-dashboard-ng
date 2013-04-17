'use strict';

var app = angular.module('lelylan.dashboards.devices', ['lelylan.components.device']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', { templateUrl: '/partials/home.html', controller: DashboardCtrl }).
    when('/new', { templateUrl: '/partials/new-device.html', controller: CreateCtrl }).
    otherwise({redirectTo: '/'});
}]);
