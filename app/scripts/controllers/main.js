'use strict';

angular.module('lelylan.dashboards.device')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, $q, $location, $cacheFactory, Device, Type, Category, AccessToken) {
    $rootScope.page = 'main';
    $rootScope.demo = !!($location.absUrl().match(/demo/));

    var $httpDefaultCache = $cacheFactory.get('$http');
    console.log("> Cached devices", $httpDefaultCache.get('http://api.lelylan.com/devices'));
    console.log("> Cached categories", $httpDefaultCache.get('http://api.lelylan.com/categories'));
    var addAll = !$httpDefaultCache.get('http://api.lelylan.com/categories');

    var categories = Category.all().
      success(function(categories) {
        console.log("Loaded > categories");
        $rootScope.categories = categories;
        if (addAll) {
          console.log("> Add 'All' categories")
          $rootScope.categories.unshift({ tag: 'all', name: 'All'});
        }
      });

    var devices = Device.all().
      success(function(devices) {
        console.log("Loaded > devices");
        $rootScope.all = devices;
        $scope.devices = devices;
        loadTypes($scope.devices);
      });

    // count the number of devices we have per category
    $q.all([devices, categories]).then(function(values) {
      console.log("Loaded > devices & categories");
      _.map($rootScope.categories, function(category) {
        var result = _.countBy($rootScope.all, function(device) {
          return (device.category == category.tag) ? 'count' : 'missed'
        });
        category.devices = result.count;
      });
      $rootScope.categories[0].devices = $rootScope.all.length;
    });

    var loadTypes = function(devices) {
      var requests = [];

      _.each(devices, function(device) {
        requests.push(Type.find(device.type.id));
      });

      $q.all(requests).then(function(values) {
        console.log("Loaded > types");
        init(values);
      });
    }

    var init = function(values) {
      $rootScope.loading = false;
      $rootScope.currentCategory = $rootScope.categories[0];
      $scope.currentDevice = $scope.devices[0];
    }


    $scope.setCategory = function(category) {
      if (category.devices) { // does not open when there are no devices per category
        $scope.devices = (category.tag == 'all') ? $rootScope.all : _.where($rootScope.all, { category: category.tag });
        $scope.currentDevice = $scope.devices[0];
        $rootScope.currentCategory = _.find($rootScope.categories, function(resource) {
          return resource.tag == category.tag;
        });

        if ($scope.columns == 'one') {
          angular.extend($scope.show, { categories: false, devices: true, details: false });
          setMenu();
        }
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


    // OAuth logics

    if (!$rootScope.demo) {
      $rootScope.logged = !!AccessToken.get();

      if (!$rootScope.logged) {
        console.log('Moving to login page');
        $location.path('login');
      }

      $scope.$on('oauth:logout', function(event) {
        console.log('The user has signed out');
        $location.path('login');
      });
    };

    $rootScope.demoOn = function() {
      console.log("Demo On");
      $rootScope.loading = true;
      $timeout(function() {
        window.location.replace('/demo.html')
      }, 300);
    };

    $rootScope.demoOff = function() {
      console.log("Demo OFF")
      $timeout(function() {
        window.location.replace('/')
        $rootScope.loading = true;
      }, 300);
    };

    $scope.$on('oauth:expired', function(event) {
      $location.path('expired')
    });

  });
