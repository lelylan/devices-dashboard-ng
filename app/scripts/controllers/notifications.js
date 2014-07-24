'use strict';

angular.module('lelylan.dashboards.device')
  .controller('NotificationsCtrl', function ($scope, $rootScope, $location, Menu) {

    /* ------- *
     * CONFIGS *
     * ------- */

    // set the view as loaded
    $rootScope.loading = false;

    // Hide the notification with the alert
    $rootScope.notification.show = false;

    // set the reset
    $rootScope.archiveNotifications = true;

    // set lelylan as top menu
    Menu.set('lelylan');
  });
