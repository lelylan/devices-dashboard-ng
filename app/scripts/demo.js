'use strict';

angular.module('lelylan.dashboards.devices.demo', ['lelylan.components.device']);

angular.module('lelylan.dashboards.devices.demo').config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', { templateUrl: 'views/home-demo.html', controller: DashboardCtrl }).
    when('/all', { templateUrl: 'views/devices.html', controller: DevicesCtrl }).
    when('/categories/:category', { templateUrl: 'views/devices.html', controller: CategoryCtrl }).
    otherwise({redirectTo: '/all'});
}]);
