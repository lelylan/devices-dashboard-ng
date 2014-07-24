'use strict';

angular.module('lelylan.dashboards.device')
  .controller('NotificationsCtrl', function ($scope, $rootScope, $location) {

    /* ------- *
     * CONFIGS *
     * ------- */

    // set the view as loaded
    $rootScope.loading = false;

    /* --------- *
     * BEHAVIOUR *
     * --------- */

    _.each($rootScope.notifications.list, function(notification) {
      notification.unread = false;
    });

    $rootScope.notifications.unread = _.where($rootScope.notifications.list, { unread: true }).length;

  });
