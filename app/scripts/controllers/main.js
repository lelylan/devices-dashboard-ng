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

    // count the number of devices we have per category
    $q.all([devices, categories]).then(function(values) {
      _.map($scope.categories, function(category) {
        var result = _.countBy($scope.all, function(device) {
          return (device.category == category.tag) ? 'count' : 'missed'
        });
        category.devices = result.count;
      });
    });

    var loadTypes = function(devices) {
      var requests = [];

      console.log("Loading types")
      _.each(devices, function(device) {
        requests.push(Type.find(device.type.id));
      });

      $q.all(requests).then(function(values) {
        init(values);
      });
    }

    var init = function(values) {
      $rootScope.loading = false;
      $scope.currentDevice = $scope.devices[0];
    }


    $scope.setCategory = function(category) {
      $scope.devices = _.where($scope.all, { category: category });
      $scope.currentDevice = $scope.devices[0];
      $scope.currentCategory = _.find($scope.categories, function(resource) {
        return resource.tag == category;
      });

      if ($scope.columns == 'one') {
        angular.extend($scope.show, { categories: false, devices: true, details: false });
        setMenu();
      }

    }

    $scope.unsetCategory = function(category) {
      $scope.devices = $scope.all;
      $scope.currentDevice = $scope.devices[0];
      $scope.currentCategory = null;

      if ($scope.columns == 'one') {
        angular.extend($scope.show, { categories: false, devices: true, details: false });
        setMenu();
      }
    }

    // set the current device in the
    $rootScope.$on('lelylan:device:custom:open', function(event, device) {
      $scope.currentDevice = device;

      if ($scope.columns == 'two') {
        angular.extend($scope.show, { categories: false, devices: true, details: true });
      }

      if ($scope.columns == 'one') {
        angular.extend($scope.show, { categories: false, devices: false, details: true });
      }

      setMenu();
    });

    // let the list of devices keep the sync with the devices
    $scope.$on('lelylan:device:update:set', function(event, device) {
      var old = _.find($scope.devices, function(resource) {
        return resource.id == device.id;
      });
      angular.extend(old, device);
    });

    $rootScope.backToCategories = function() {
      if ($scope.columns == 'two') {
        angular.extend($scope.show, { categories: true, devices: true, details: false });
      }

      if ($scope.columns == 'one') {
        angular.extend($scope.show, { categories: true, devices: false, details: false });
      }

      setMenu();
    };

    $rootScope.backToDevices = function() {

      if ($scope.columns == 'one') {
        angular.extend($scope.show, { categories: false, devices: true, details: false });
      }

      setMenu();
    };







    var setMenu = function() {

      if ($scope.columns == 'three') {
        angular.extend($scope.menu, { lelylan: true, categories: false, devices: false });
      }

      if ($scope.columns == 'two') {
        if ($scope.show.categories) { angular.extend($scope.menu, { categories: false, devices: false }); }
        if ($scope.show.details)    { angular.extend($scope.menu, { categories: true,  devices: false }); }
      }

      if ($scope.columns == 'one') {
        if ($scope.show.categories) { angular.extend($scope.menu, { categories: false, devices: false }); }
        if ($scope.show.devices)    { angular.extend($scope.menu, { categories: true,  devices: false }); }
        if ($scope.show.details)    { angular.extend($scope.menu, { categories: false, devices: true }); }
      }
    }
  });
