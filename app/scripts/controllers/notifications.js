'use strict';

angular.module('lelylan.dashboards.device')
  .controller('NotificationsCtrl', function ($scope, $rootScope, $location, Menu) {

    /* ------- *
     * CONFIGS *
     * ------- */

    // check the notifications existance
    if ($rootScope.notifications.list.length == 0) {
      $location.path('/no-notifications')
    };

    // set the view as loaded
    $rootScope.loading = false;

    // set lelylan as top menu
    Menu.set('lelylan');

    /* --------- *
     * BEHAVIOUR *
     * --------- */


    _.each($rootScope.notifications.list, function(notification) {
      notification.unread = false;
    });

    $rootScope.notifications.unread = _.where($rootScope.notifications.list, { unread: true }).length;

  });
