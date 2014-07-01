'use strict';

angular.module('lelylan.dashboards.device')
  .controller('CreateCtrl', function ($scope, $rootScope, $location, Device) {
    $rootScope.loading = false;

    $scope.device = {};
    $scope.step = 'one';

    $scope.setStep = function(step) {
      $scope.step = step
    }

    $scope.types = fixturePopularTypes;

    $scope.setType = function(type) {
      $scope.device.type = { id: type.id };
      $scope.setStep('three');
    }

    $scope.setPhysical = function(mode) {
      $rootScope.loading = true;

      console.log($rootScope.all);

      if (mode == 'simulate') {
        Device.create($scope.device).success(redirect);
      }

      if (mode == 'mqtt') {
        Device.create($scope.device).success(function(device) {
          $scope.device.physical = { uri: "http://nodes.lelylan.com/mqtt/devices/" + device.id };
          Device.update(device.id, $scope.device).success(redirect);
        })
      }

      if (mode == 'custom') {
        Device.create($scope.device).success(redirect);
      }

      // after the definition I add the device to the device list
    }

    var redirect = function(device) {
      if ($rootScope.all) { // if cached
        $rootScope.all.unshift(device);
      }

      if ($rootScope.categories) { // if cached
        $rootScope.currentCategory = $rootScope.categories[0];
        var category = _.find($rootScope.categories, function(resource) { return resource.tag == device.category; });
        category.devices++;
      }

      $location.path('/');
    }
  });
