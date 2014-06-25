'use strict';

angular.module('lelylan.dashboards.device')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, $q, Device, Type, Category) {

    var categories = Category.all().
      success(function(categories) {
        $scope.categories = categories;
      });

    var devices = Device.all().
      success(function(devices) {
        $scope.all = devices;
        $scope.devices = devices;
        loadTypes($scope.devices);
      });

    $q.all([devices, categories]).then(function(values) {
      _.map($scope.categories, function(category) {
        var result = _.countBy($scope.devices, function(device) {
          return (device.category == category.tag) ? 'count' : 'missed'
        });
        category.count = result.count
      });

      console.log($scope.categories)

    });



    var loadTypes = function(devices) {
      var requests = [];

      _.each(devices, function(device) {
        requests.push(Type.find(device.type.id));

        $q.all(requests).then(function(values) {
          init(values);
        });
      });
    }

    var init = function(values) {
      console.log('Loaded all types', values);
      $rootScope.loading = false;
      $scope.currentDevice = $scope.devices[0];
    }


    $scope.setCategory = function(category) {
      $scope.devices = _.where($scope.all, { category: category });
      console.log($scope.devices);
      $scope.currentDevice = $scope.devices[0];
      $scope.currentCategory = _.find($scope.categories, function(resource) {
        return resource.tag == category;
      });
    }

    $scope.unsetCategory = function(category) {
      $scope.devices = $scope.all;
      $scope.currentDevice = $scope.devices[0];
      $scope.currentCategory = null;
    }

    // set the current device in the
    $rootScope.$on('lelylan:device:custom:open', function(event, device) {
      $scope.currentDevice = device;
    });

    // let the list of devices keep the sync with the devices
    $scope.$on('lelylan:device:update:set', function(event, device) {
      var old = _.find($scope.devices, function(resource) {
        return resource.id == device.id;
      });
      angular.extend(old, device);
    });
  });
