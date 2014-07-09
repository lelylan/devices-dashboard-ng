'use strict';

angular.module('lelylan.dashboards.device')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, $q, $location, $cacheFactory, Device, Type, Category, AccessToken, Dimension, Column, Menu) {


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

    // Logged in user
    $scope.logged = !!AccessToken.get();


    /*
     * OAuth
     */

    // Move to the login page when not logged in and when logs out
    if (!$scope.demo) {
      if (!$scope.logged) {
        $location.path('login');
      }

      $scope.$on('oauth:logout', function(event) {
        $location.path('login');
      });
    };


    /*
     * Token expiration
     */

    $scope.$on('oauth:expired', function(event) {
      $location.path('expired');
    });


    /*
     * Demo logic
     */

    $rootScope.demoOn = function() {
      $rootScope.loading = true;
      $timeout(function() { window.location.replace('/demo.html'); }, 300);
    };

    $rootScope.demoOff = function() {
      $timeout(function() {
        window.location.replace('/');
        $rootScope.loading = true;
      }, 300);
    };
  });
