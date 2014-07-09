'use strict';

angular.module('lelylan.dashboards.device')
  .controller('DevicesCtrl', function ($scope, $rootScope, $timeout, $q, $location, $cacheFactory, Device, Type, Category, AccessToken, Dimension, Column, Menu) {

    //
    // CONFIGS
    //

    // Flag telling us if the demo mode is active
    $rootScope.demo = !!($location.absUrl().match(/demo/));

    // App dimensions (to fit the page)
    $rootScope.dimensions = Dimension.get();

    // Visible columns
    $rootScope.columns = Column.get();

    // Visible menu (on the left)
    $rootScope.menu = Menu.get();

    // Cached categories check
    // TODO - We can't use hard coded domains
    var cached = $cacheFactory.get('$http').get('http://api.lelylan.com/categories');



    //
    // API REQUESTS
    //

    // Load categories (and add `All` category the first time)
    var categories = Category.all().
      success(function(categories) {
        $rootScope.categories = categories;
        if (!cached) { $rootScope.categories.unshift({ tag: 'all', name: 'All'}); }
      });

    // Load all devices
    var devices = Device.all().
      success(function(devices) {
        $rootScope.all = devices;
        $scope.devices = devices;
        loadTypes($scope.devices);
      });

    // Count the number of devices per category ones devices anda categories are loaded
    $q.all([devices, categories]).then(function(values) {
      $rootScope.categories[0].devices = $rootScope.all.length;

      _.map($rootScope.categories, function(category) {
        category.devices = _.countBy($rootScope.all, function(device) {
          return (device.category == category.tag) ? 'count' : 'missed'
        }).count;
      });
    });

    // Preload all types
    var loadTypes = function(devices) {
      var requests = _.map(devices, function(device) {
        return Type.find(device.type.id)
      });

      $q.all(requests).then(function(values) {
        init(values);
      });
    }



    /*
     * INITIALIZATION
     */

    // Stop the preloading and set the default category and device
    var init = function(values) {
      $rootScope.loading = false;
      $scope.currentDevice = $scope.devices[0];
      $rootScope.currentCategory = $rootScope.categories[0];
    }



    /*
     * CATEGORY SELECTION
     */

    // When there is at least one device per category we make it clickable
    $scope.setCategory = function(category) {
      if (category.devices) { // does not open when there are no devices per category
        $scope.devices = (category.tag == 'all') ? $rootScope.all : _.where($rootScope.all, { category: category.tag });
        $scope.currentDevice = $scope.devices[0];
        $rootScope.currentCategory = category;

        if ($rootScope.columns.count == 'one') {
          Column.setVisibles({ one: false, two: true, three: false });
          Column.set();
        }
      }
    }



    /*
     * DEVICE SELECTION
     */

    // When clicking on the compact view we open the detailed view
    $rootScope.$on('lelylan:device:custom:open', function(event, device) {
      $scope.currentDevice = device;
      if ($rootScope.columns.count == 'two') { Column.setVisibles({ one: false, two: true, three: true });  }
      if ($rootScope.columns.count == 'one') { Column.setVisibles({ one: false, two: false, three: true }); }
      Column.set();
    });



    /*
     * DEVICE UPDATE
     */

    // Sync the list of devices with the coming updates
    $scope.$on('lelylan:device:update:set', function(event, device) {
      var _device = _.find($scope.devices, function(resource) {
        return resource.id == device.id;
      });
      angular.extend(_device, device);
    });



    /*
     * MENU COLUMNS NAVIGAION
     */

    // Move back to categories
    $rootScope.moveToCategories = function() {
      if ($rootScope.columns.count == 'two') { Column.setVisibles({ one: true, two: true, three: false });  }
      if ($rootScope.columns.count == 'one') { Column.setVisibles({ one: true, two: false, three: false }); }
      Column.set();
    };

    // Move back to devices
    $rootScope.moveToDevices = function() {
      if ($rootScope.columns.count == 'one') { Column.setVisibles({ one: false, two: true, three: false }); }
      Column.set();
    };

  });
