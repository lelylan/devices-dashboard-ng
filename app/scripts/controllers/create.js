'use strict';

angular.module('lelylan.dashboards.device')
  .controller('CreateCtrl', function ($scope, $rootScope) {

    $rootScope.loading = false;
    $scope.step = 'one';

  });
