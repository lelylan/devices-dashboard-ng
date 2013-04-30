'use strict';

function DashboardCtrl(AccessToken, $scope, $rootScope, $http, $location) {
  $rootScope.active = '';
  $scope.oauth = {
    redirect: 'http://d.lelylan.com',
    client:   '017b9f702a904869a80a0f9fd8ed88838f6e52bd39b147b19e69fed705e1b912',
    scope:    'resources+privates'
  };

  $scope.$on('lelylan:logout', function(event) { $location.path('/home'); });
};

DashboardCtrl.$inject = ['AccessToken', '$scope', '$rootScope', '$http', '$location'];

var cl = new CanvasLoader('lelylan-request-loading');
cl.setColor('#239cbb');
cl.setShape('spiral');
cl.setDiameter(20);
cl.setDensity(70);
cl.setRange(0.7);
cl.setSpeed(2);
cl.setFPS(35);
cl.show();
