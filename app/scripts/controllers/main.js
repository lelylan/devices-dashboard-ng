'use strict';

angular.module('lelylan.dashboards.device')
  .controller('MainCtrl', function ($scope, $timeout) {

    $timeout(function() { $scope.$broadcast('rebuild:me') }, 0);

  });
