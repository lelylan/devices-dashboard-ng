'use strict';

angular.module('lelylan.dashboards.device')
  .controller('CreateCtrl', function ($scope, $rootScope, $location, Device) {
    $rootScope.page = 'create';
    $rootScope.loading = false;

    $scope.step = 'three';
    $scope.device = {};
    $scope.invalid = {};

    $scope.confirmName = function() {
      console.log($scope.invalid)
      $scope.invalid.one = false;
      $scope.setStep('two');
    }

    $scope.setStep = function(step) {
      $scope.step = step
    }

    $scope.types = fixturePopularTypes;

    $scope.setType = function(type) {
      $scope.invalid.two = false;
      $scope.device.type = { id: type.id };
      $scope.setStep('three');
    }

    $scope.setPhysical = function(mode) {

      if (!$scope.device.name) { $scope.invalid.one = true }
      if (!$scope.device.type) { $scope.invalid.two = true }

      console.log($scope.invalid)

      if ($scope.device.name && $scope.device.type) { // all fields set

        $rootScope.loading = true;

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
