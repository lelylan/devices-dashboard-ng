'use strict';

function DashboardCtrl(AccessToken, $scope, $rootScope, $http, $location, $timeout) {
  $rootScope.active = '';
  $scope.alerts = [];

  $scope.oauth = {
    client:   '017b9f702a904869a80a0f9fd8ed88838f6e52bd39b147b19e69fed705e1b912',
    redirect: 'http://d.lelylan.com',
    scope:    'resources+privates'
  };

  $scope.$on('lelylan:logout', function(event) {
    $rootScope.active = '';
    $location.path('/home');
  });

  $scope.$on('lelylan:device:delete', function(event, device) {
    $rootScope.active = '';
    $location.path('/');
    $scope.alerts.push({ type: 'success', msg: device.name + ' successfully deleted' })
    $timeout(function() { $scope.closeAlert($scope.alerts.length - 1) }, 10000);
  });

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
};

DashboardCtrl.$inject = ['AccessToken', '$scope', '$rootScope', '$http', '$location', '$timeout'];

var cl = new CanvasLoader('lelylan-request-loading');
cl.setColor('#239cbb');
cl.setShape('spiral');
cl.setDiameter(20);
cl.setDensity(70);
cl.setRange(0.7);
cl.setSpeed(2);
cl.setFPS(35);
cl.show();
