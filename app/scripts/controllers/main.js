'use strict';

angular.module('lelylan.dashboards.device')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, $q, $location, $route, $cacheFactory, ENV, Device, Type, Category, AccessToken, Dimension, Column, Menu, Notifications, Socket) {

    /*
     * Configs
     */

    // Flag telling us if the demo mode is active
    $scope.demo = !!($location.absUrl().match(/demo/));

    //
    $timeout(function() {
      $scope.logged = !!AccessToken.get();
    }, 0);

    // App dimensions (to fit the page)
    $scope.dimensions = Dimension.get();

    // Visible columns
    $scope.columns = Column.get();

    // Visible menu (on the left)
    $scope.menu = Menu.get();

    // OAuth credentials
    $scope.credentials = ENV.credentials;

    // Notifications list
    $rootScope.notifications = { list: Notifications.get(), unread: 0 };

    // Notification for device update
    $rootScope.notification = {};

    // Types container
    $rootScope.types = [];


    /*
     * OAuth
     */

    $timeout(function() {
      var logged = !!AccessToken.get();

      if (!$scope.demo) {
        if (!logged) {
          $location.path('login');
        }

        $scope.$on('oauth:logout', function(event) {
          $location.path('login');
          Menu.set('lelylan');
        });
      };

      $rootScope.load();
    }, 0)


    /* ------------------------ *
     * AUTHORIZED INITIALIZATION *
     * ------------------------- */

    $rootScope.load = function() {

      /*
      * Categories API request
      */

      // Verify if categories is already cached
      var cached = $cacheFactory.get('$http').get(ENV.endpoint + '/categories');

      // Get all categories
      var categories = Category.all().success(function(categories) {
        $rootScope.categories = categories;
        $rootScope.categories.unshift({ tag: 'all', name: 'All'});
        $rootScope.currentCategory = $rootScope.categories[0];
      });



      /*
      * Devices API request
      */

      var devices = Device.all().
        success(function(devices) {
        $rootScope.all = devices;
        $rootScope.devices = devices;

        if (devices.length == 0) { $location.path('/no-devices') }
        else                     { loadTypes($rootScope.devices); }
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
        var runningRequests = [];

        var requests = _.map(devices, function(device) {
          // hack to make once the call to a specific type resource
          var called = _.contains(runningRequests, device.type.id);
          if (!called) {
            runningRequests.push(device.type.id);
            return Type.find(device.type.id);
          }
        });

        var requests = _.reject(requests, function(req){ return req == undefined; });

        $q.all(requests).then(function(values) {
          $rootScope.types = _.map(values, function(value) { return value.data });
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
        $scope.currentDevice = $rootScope.devices[0];
      }

    }




    /*
     * Token expiration
     */

    $scope.$on('oauth:expired', function(event) {
      $location.path('expired');
    });



    /*
     * Demo logic (with some timers to make the experience smoother)
     */

    $rootScope.demoOn = function() {
      $rootScope.loading = true;
      $timeout(function() { window.location.replace('demo.html'); }, 300);
    };

    $rootScope.demoOff = function() {
      $timeout(function() {
        window.location.replace('index.html');
        $rootScope.loading = true;
      }, 300);
    };



    /*
     * Websocket definition
     */

    $timeout(function() {
      var logged = !!AccessToken.get();

      if (logged) {

        Socket.on('connect', function() {
          Socket.emit('subscribe', AccessToken.get().access_token);
        });

        Socket.on('update', function (event) {

          var notifications = Notifications.push(event.data);
          $rootScope.$broadcast('lelylan:device:update:set', event.data);


          /*
           * fix bug on rendering the devices list when I was in another page
           */

          var cached = $cacheFactory.get('$http').get(ENV.endpoint + '/devices');
          var devices = JSON.parse(cached[1]);

          var _device = _.find(devices, function(resource) {
            return resource.id == event.data.id;
          });

          angular.extend(_device, event.data);
          cached[1] = JSON.stringify(devices);


          /*
           * hide the notification whith the alert in the notification page
           */

          if ($route.current.$$route.controller != 'NotificationsCtrl') {

            if (notifications.length > 0 && notifications[0].changes.length > 0) {

              if (!$rootScope.notification.show)
                $scope.dimensions.height -= 2;

              if ($rootScope.notification.timeout) {
                $timeout.cancel($rootScope.notification.timeout);
              }

              if ($rootScope.notification.timeoutHeight) {
                $timeout.cancel($rootScope.notification.timeoutHeight);
              }

              $rootScope.notification.show    = true;
              $rootScope.notification.message = notifications[0].message;
              $rootScope.notification.device  = notifications[0].device;

              $rootScope.notification.timeout = $timeout(function() {
                $rootScope.notification.show  = false;
              }, 5000);

              // set the height with 500ms of delay to not see the scrollbar
              $rootScope.notification.timeoutHeight = $timeout(function() {
                $scope.dimensions.height += 2;
              }, 5000+500);


            } else {
              // remove the notification id created from the same page
              $rootScope.notifications.list.shift();
            }
          }

          countUnreadNotifications();
        });
      }
    });


    /*
     * Device updated
     */

    $scope.$on('lelylan:device:update:set', function(event, device) {

      var _device = _.find($rootScope.all, function(resource) {
        return resource.id == device.id;
      });

      angular.extend(_device, device);
    });


    /* --------------------- *
     * READ UNREAD BEHAVIOUR *
     * --------------------- */

    $scope.$on('$routeChangeStart', function(next, current) {

      if ($rootScope.archiveNotifications == true) {
        $rootScope.archiveNotifications = false;
        _.each($rootScope.notifications.list, function(notification) {
          notification.unread = false;
        });
      }

      countUnreadNotifications();
    });


    var countUnreadNotifications = function() {
      $rootScope.notifications.unread = _.where($rootScope.notifications.list, { unread: true }).length;
      if ($rootScope.notifications.unread >= 50) {
        $rootScope.notifications.unread = '+50';
      }
    }

  });
