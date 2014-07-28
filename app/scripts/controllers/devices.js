'use strict';

angular.module('lelylan.dashboards.device')
  .controller('DevicesCtrl', function ($scope, $rootScope, $timeout, $q, $location, $route, $cacheFactory, ENV, Device, Type, Category, AccessToken, Dimension, Column, Menu) {

    /* ------------------------ *
     * AUTHORIZED INITIALIZATION *
     * ------------------------- */


    if (!$scope.demo)
      $rootScope.load();



    /* --------- *
     * BEHAVIOUR *
     * --------- */


    /*
     * Category selection
     */

    $scope.setCategory = function(category) {
      if (category.devices) { // does not open when there are no devices per category
        $rootScope.devices = (category.tag == 'all') ? $rootScope.all : _.where($rootScope.all, { category: category.tag });
        $scope.currentDevice = $rootScope.devices[0];
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
     * Device deleted
     */

    $rootScope.$on('lelylan:device:delete', function(event, device) {
      var cached = $cacheFactory.get('$http').get(ENV.endpoint + '/devices');
      var devices = JSON.parse(cached[1]);

      var _device = _.find(devices, function(resource) {
        return resource.id == device.id;
      });

      if (_device) {
        var index = devices.indexOf(_device);
        devices.splice(index, 1);
        cached[1] = JSON.stringify(devices);
      }

      if ($scope.columns.count == 'one') {
        Column.setVisible({ one: false, two: true, three: false });
        Menu.set('categories');
      }

      $route.reload();
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


    // set the default menu when opening the page
    if ($scope.columns.count == 'one') {
      Column.setVisible({ one: false, two: true, three: false });
      Menu.set('categories');
    }

  });
