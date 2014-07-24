'use strict';

angular.module('lelylan.dashboards.device')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, $q, $location, $cacheFactory, ENV, Device, Type, Category, AccessToken, Dimension, Column, Menu, Notifications) {


    /*
     * Configs
     */

    // Flag telling us if the demo mode is active
    $scope.demo = !!($location.absUrl().match(/demo/));

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
        });
      };
    }, 0)



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
        var socket = io.connect('ws://127.0.0.1:8002');

        socket.on('connect', function() {
          console.log('Connected to the realtime system');
          socket.emit('subscribe', AccessToken.get().access_token);
        });

        socket.on('update', function (event) {
          var notifications = Notifications.push(event.data);
          $rootScope.$broadcast('lelylan:device:update:set', event.data);
        });
      }
    });


    /*
     * Notifications
     */

    $rootScope.$watchCollection('notifications.list',
      function(newValue) {
        // if there it's not on login and it's not the page that makes the change
        if ($rootScope.notifications.list.length > 0 && $rootScope.notifications.list[0].changes.length > 0) {
          var notification = $rootScope.notifications.list[0];

          if ($rootScope.notification.timeout) {
            $timeout.cancel($rootScope.notification.timeout);
          }

          $rootScope.notification.show    = true;
          $rootScope.notification.message = $rootScope.notifications.list[0].message;

          $rootScope.notification.timeout = $timeout(function() {
            $rootScope.notification.show  = false;
          }, 5000);
        } else {
          // remove the notification id created from the same page
          $rootScope.notifications.list.shift();
        }

        $rootScope.notifications.unread = _.where($rootScope.notifications.list, { unread: true }).length
      }
    );

  });
