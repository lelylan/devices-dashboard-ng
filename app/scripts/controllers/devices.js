'use strict';

angular.module('lelylan.dashboards.device')
  .controller('DevicesCtrl', function ($scope, $rootScope, $timeout, $q, $location, $cacheFactory, Device, Type, Category, AccessToken, Dimension, Column, Menu) {


    /* -------------- *
     * INITIALIZATION *
     * -------------- */


    /*
     * Categories API request
     */

    // Verify if categories is already cached
    var cached = $cacheFactory.get('$http').get('http://api.lelylan.com/categories');

    // Get all categories
    var categories = Category.all().
      success(function(categories) {
        $rootScope.categories = categories;
        if (!cached) { $rootScope.categories.unshift({ tag: 'all', name: 'All'}); }
      });



    /*
     * Devices API request
     */

    var devices = Device.all().
      success(function(devices) {
        $rootScope.all = devices;
        $scope.devices = devices;
        loadTypes($scope.devices);
      });



    /*
     * Devices per category
     *
     * Counts the number of devices per category when all devices and
     * all categories are loaded.
     */

    $q.all([devices, categories]).then(function(values) {
      _.map($rootScope.categories, function(category) {
        category.devices = _.countBy($rootScope.all, function(device) {
          return (device.category == category.tag) ? 'count' : 'missed'
        }).count;
      });

      $rootScope.categories[0].devices = $rootScope.all.length;
    });



    /*
     * Types preloading
     *
     * Makes an API request to each device type to cache it. This let you
     * move between all devices instantaneously
     */

    var loadTypes = function(devices) {
      var requests = _.map(devices, function(device) {
        return Type.find(device.type.id)
      });

      $q.all(requests).then(function(values) {
        init(values);
      });
    }



    /*
     * Visualization
     *
     * All resources (categories, devices and types) are loaded and can be shown.
     */

    var init = function(values) {
      $rootScope.loading = false;
      $scope.currentDevice = $scope.devices[0];
      $rootScope.currentCategory = $rootScope.categories[0];
    }



    /* --------- *
     * BEHAVIOUR *
     * --------- */


    /*
     * Category selection
     */

    $scope.setCategory = function(category) {
      if (category.devices) { // does not open when there are no devices per category
        $scope.devices = (category.tag == 'all') ? $rootScope.all : _.where($rootScope.all, { category: category.tag });
        $scope.currentDevice = $scope.devices[0];
        $rootScope.currentCategory = category;

        if ($scope.columns.count == 'one') {
          Column.setVisible({ one: false, two: true, three: false });
          Column.set($scope.dimensions);
        }
      }
    }



    /*
     * Device selection
     */

    $rootScope.$on('lelylan:device:custom:open', function(event, device) {
      $scope.currentDevice = device;

      if ($scope.columns.count == 'two') {
        Column.setVisible({ one: false, two: true, three: true });
        Menu.set('categories');
      }

      if ($scope.columns.count == 'one') {
        Column.setVisible({ one: false, two: false, three: true });
        Menu.set('devices');
      }
    });



    /*
     * Device updated
     */

    $scope.$on('lelylan:device:update:set', function(event, device) {
      var _device = _.find($scope.devices, function(resource) {
        return resource.id == device.id;
      });

      angular.extend(_device, device);
    });



    /* ---------- *
     * Navigation *
     * ---------- */


    /*
     * Move back to categories
     */

    $rootScope.moveToCategories = function() {

      if ($scope.columns.count == 'two') {
        Column.setVisible({ one: true, two: true, three: false });
        Menu.set('none');
      }

      if ($scope.columns.count == 'one') {
        Column.setVisible({ one: true, two: false, three: false });
        Menu.set('none');
      }

    };



    /*
     * Move back to devices
     */

    $rootScope.moveToDevices = function() {
      if ($scope.columns.count == 'one') {
        Column.setVisible({ one: false, two: true, three: false });
        Menu.set('categories')
      }
    };

  });
