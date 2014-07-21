'use strict';

angular.module('lelylan.dashboards.device')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, $q, $location, $cacheFactory, ENV, WebSocket, Device, Type, Category, AccessToken, Dimension, Column, Menu) {


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
        console.log("Connecting to realtime")
        var socket = io.connect('ws://127.0.0.1:8002');

        socket.on('connect', function() {
          socket.emit('subscribe', AccessToken.get().access_token);
        });

        socket.on('update', function (event) {
          $rootScope.$broadcast('lelylan:device:update:set', event.data);
        });
      }
    });
  });
