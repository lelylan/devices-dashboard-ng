'use strict';

angular.module('lelylan.components.device', [
  'lelylan',
  'lelylan.components.device.directive'
]);

'use strict';

// TODO(reggie) Apply a whole code refactoring to the javascript
// TODO(reggie) Set all classes to be independent using the prefix dc (*d*evice *c*omponent)
var directives = angular.module('lelylan.components.device.directive', [])

directives.directive('device', ['Device', 'Type', 'LoggedUser', '$rootScope', '$timeout',
  function(Device, Type, LoggedUser, $rootScope, $timeout) {

  var template =
    '<div class="device-component device-{{device.id}} type-{{type.id}}">' +
      '<div class="dc-message" ng-show="destroyed && loaded">' +
        '<p class="lead">The device <strong>{{type.name}}</strong> has been successfully deleted</p>' +
      '</div>' +
      '<div class="dc-main" ng-show="!destroyed && loaded">' +
        // Device header
        '<div class="dc-header">' +
          '<p class="dc-title lead" ng-show="!list">{{device.name}}</p>' +
          // Options
          '<div class="dc-options" ng-show="options">' +
            '<ul class="nav nav-pills">' +
              '<li><a href="javascript:" class="action-refresh" ng-click="refresh()"><i class="icon-repeat"></i> Refresh</a></li>' +
              '<li><a href="javascript:" class="action-extend" ng-show="!extended" ng-click="extend()"><i class="icon-chevron-down"></i> Extended</a></li>' +
              '<li><a href="javascript:" class="action-compact" ng-show="extended" ng-click="compact()"><i class="icon-chevron-up"></i> Compact</a></li>' +
              '<li><a href="javascript:" class="action-main" ng-show="action.settings" ng-click="showMain()"><i class="icon-chevron-left"></i> Back</a></li>' +
              '<li><a href="javascript:" class="action-settings" ng-show="action.main" ng-click="showSettings()"><i class="icon-pencil"></i> Settings</a></li>' +
            '</ul>' +
          '</div>' +
          // Default status
          '<div class="dc-function function-{{status.function.id}} row-fluid">' +
            '<div class="action">' +
              '<a href="javascript:" ng-click="execute(status.function)" class="execute" title="{{status.function.name}}"></a>' +
              '<div ng-show="device.pending" id="pending-{{$id}}-{{device.id}}" class="pending"></div>' +
            '</div>' +
            '<div class="dc-description" ng-show="!list">' +
              '<p class="status lead">{{status.name}}</p>' +
              '<small class="dc-updated-from muted">{{device.updated_at_relative}} from {{device.updated_from.name}}</small>' +
            '</div>' +
            '<div class="dc-list-description" ng-show="list" ng-click="fireOpen()" ng-mouseover="entry=true" ng-mouseleave="entry=false">' +
              '<p class="lead color dc-name">{{device.name}}</p>' +
              '<p class="lead dc-status-name"><em>{{status.name}}</em></p>' +
              '<a ng-show="!entry" class="dc-open" href="javascript:"><img class="dc-details" src="/images/chevron-right.png"></a>' +
              '<a ng-show="entry" class="dc-open" href="javascript:"><img class="dc-details" src="/images/chevron-right-hover.png"></a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // Device main information
        '<div class="dc-main" ng-show="action.main && extended">' +
          // Functions
          '<div class="dc-functions">' +
            '<hr/>' +
            '<div class="dc-function function-{{function.id}}" ng-repeat="function in functions">' +
              '<div class="row-fluid">' +
                '<div class="action">' +
                  '<a href="javascript:" ng-click="execute(function)" title="Execute {{function.name}}" class="execute"></a>' +
                '</div>' +
                '<div class="dc-description">' +
                  '<p class="name lead"><a href="javascript:" ng-click="execute(function)">{{function.name}}</a></p>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          // Properties
          '<div class="dc-properties">' +
            '<hr/>' +
            '<p class="lead">Device Properties</p>' +
            '<div class="dc-property property-{{property.id}}" ng-repeat="property in device.properties">' +
              '<span class="name"><i class="icon-chevron-right"></i> {{property.name}}</span> ' +
              '<span class="value color">{{property.suggested[property.expected] || property.expected}}</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // Function forms
        '<div class="dc-function-forms">' +
          '<div class="dc-function-form function-form-{{function.id}}" ng-show="function.visible" ng-repeat="function in functions">' +
            '<div class="row-fluid">' +
              '<div>' +
                '<p class="title lead">{{function.name}}</p>' +
                '<small class="name muted">Fill the required params and execute your function</small>' +
                '<hr/>' +
                '<form>' +
                  '<div ng-repeat="property in function.properties" ng-show="property.visible" class="property property-{{property.id}}">' +
                    '<div>' +
                      '<small class="muted">Set {{property.name}} to {{property.value}}</small><br/>' +
                      '<input type="{{property.type}}" min="{{property.range.min}}" max="{{property.range.max}}" step="{{property.range.step}}" ng-model="property.value"></input>' +
                    '</div>' +
                  '</div>' +
                  '<div>' +
                    '<button ng-click="updateProperties(function.properties)" class="update btn"><i class="icon-ok-sign"></i> Execute</button>' +
                    '<button ng-click="function.visible=false" class="destroy btn"><i class="icon icon-remove"></i> Cancel</button>' +
                  '</div>' +
                '</form>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // Settings
        '<div class="dc-settings" ng-show="action.settings">' +

          // Edit
          '<div class="dc-edit">' +
            '<hr/>' +
            '<div>' +
              '<p class="lead">Edit Device</p>' +
              '<form name="editForm">' +
                '<div class="control-group" ng-class="{error: editForm.name.$invalid}">' +
                  '<div class="input-prepend">' +
                    '<span class="add-on">Name &nbsp; &nbsp;</span>' +
                    '<input type="text" name="name" ng-model="device.name" required><br/>' +
                  '</div>' +
                  '<small ng-show="editForm.name.$error.required" class="help-inline">Required</small>' +
                '</div>' +
                '<div class="control-group" ng-class="{error: editForm.physical.$invalid}" ng-show="user.id == device.creator_id">' +
                  '<div class="input-prepend">' +
                    '<span class="add-on">Physical</span>' +
                    '<input type="url" name="physical" ng-model="device.physical"><br/>' +
                  '</div>' +
                  '<small ng-show="!editForm.physical.$error.url" class="help-inline">Set the physical device URI to connect</small>' +
                  '<small ng-show="editForm.physical.$error.url" class="help-inline">Not a URL</small>' +
                '</div>' +
                '<div>' +
                  '<button ng-click="update()" ng-disabled="editForm.$invalid || editForm.$pristine" class="update btn"><i class="icon-pencil"></i> Update</button>' +
                  '<button ng-click="clear()" ng-disabled="editForm.$pristine" class="cancel btn"><i class="icon-refresh"></i> Cancel</button>' +
                '</div>' +
              '</form>' +
            '</div>' +
          '</div>' +

          // Destroy device
          '<div class="dc-destroy" ng-show="user.id == device.creator_id">' +
            '<hr/>' +
            '<div>' +
              '<p class="lead">Delete Device</p>' +
              '<form name="destroyForm">' +
                '<div class="control-group" ng-class="{error: confirm!=device.name}">' +
                  '<div class="input-prepend">' +
                    '<span class="add-on">Device name</span>' +
                    '<input class="input-medium" type="text" name="name" ng-model="confirm"><br/>' +
                  '</div>' +
                  '<small class="help-inline">Deleting your device is irreversible. Enter your device name to confirm you want to permanently delete it.</small>' +
                '</div>' +
                '<div>' +
                  '<button ng-click="destroy()" ng-disabled="confirm!=device.name" class="destroy btn btn-danger"><i class="icon-white icon-remove"></i> Delete Device</button>' +
                '</div>' +
              '</form>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  var definition = {
    restrict: 'EA',
    replace: true,
    template: template,
    scope: {
      deviceId: '=',
      deviceJson: '=',
      deviceType: '=',
      deviceView: '@',
      deviceWidth: '=',
      deviceOptions: '@',
    }
  };

  definition.link = function postLink(scope, element, attrs) {

    scope.action = { main: true };
    scope.loaded = false;
    scope.user   = LoggedUser.get();

    // Watchers
    scope.$watch('deviceId', function(value) {
      if (scope.deviceId) scope.device = Device.get({ id: scope.deviceId }, initialize);
    });

    scope.$watch('deviceJson', function(value, old) {
      if (scope.deviceJson) {
        scope.device = scope.deviceJson;
        scope.type = null;
        initialize();
      }
    });

    scope.$watch('deviceType', function(value, old) {
      if (scope.deviceType) { scope.type = scope.deviceType; }
      if (value != old) { initFunctionForms(); initResources(); } // HACK to reload the type when it changes (and device is already loaded)
    });

    scope.$watch('deviceView', function(value) {
      scope.list = (scope.deviceView == 'list');
      scope.extended = (scope.deviceView == 'compact') ? false : true
      scope.extended = (scope.deviceView == 'list') ? false : scope.extended
    });

    scope.$watch('deviceWidth', function(value) {
      scope.width = (scope.deviceWidth) ? scope.deviceWidth : 300
    });

    scope.$watch('deviceOptions', function(value) {
      scope.options = (scope.deviceOptions) ? scope.deviceOptions : true
      if (scope.deviceView == 'list' && !scope.deviceOptions) scope.options = false;
    });

    // Component initialization.
    var initialize = function() {
      if (scope.deviceType) { scope.type = scope.deviceType } // HACK due to the fact that the type component could not be loaded yet
      (scope.type) ? initComponent() : scope.type = Type.get({ id: scope.device.type.id }, initComponent);
    };

    var initComponent = function() {
      initFunctionForms();       // define the function form logic
      initResources();           // extend device.properties and function.each.properties
      $timeout(setPreloader, 0); // define the preloader
      scope.loaded = true;       // until the initialization part is not ended the component is not visible
    };

    // Extend device.properties and function.each.properties binding values.
    var initResources = function(external) {
      if (scope.loaded && external) fireRequestEnd(); // send an event when properties are updated
      extendDeviceProperties();           // extende device properties with type properties
      extendFunctionsProperties();        // extende type functions properties with type properties
      setDeviceStatus();                  // find the device status
      hideFunctionForms();
    };

    // Menu options
    scope.showSettings = function() { scope.action = { settings: true }; };
    scope.showMain     = function() { scope.action = { main: true }; };
    scope.compact      = function() { scope.extended = false; scope.action = { main: true }; };
    scope.extend       = function() { scope.extended = true; scope.action = { main: true }; };

    // Execute the device function. If the function form is visible it first shows it.
    scope.execute = function(_function) {
      (!_function.hasForm) ? scope.updateProperties(_function.properties) : _function.visible = !_function.visible;
      hideFunctionForms(_function.id);
    };


    // Update the device properties
    scope.updateProperties = function(properties) {
      var device = new Device({ id: scope.device.id, properties: properties});
      device.$properties({}, function() {
        scope.device = device;
        initResources()
      });

      scope.device.pending = true;
      fireRequestStart();
    };

    // Reload the device
    scope.refresh = function() {
      scope.device.pending = true;
      scope.refreshing = Device.get({ id: scope.device.id }, initResources);
    };

    // Update the device
    scope.update = function() {
      scope.device.$update(function() {
        initResources();
        scope.showMain();
        scope.editForm.$setPristine();
      });
    };

    // Destroy the resource and hide the component
    scope.destroy = function() {
      scope.device.$delete(function() {
        scope.destroyed = true;
        fireDelete();
      })
    }

    scope.clear = function() {
      scope.device.name = scope.original.name;
      scope.device.physical = scope.original.physical;
      scope.editForm.$setPristine();
    }

    // ----------------
    // Helper methods
    // ----------------

    // Extends the device properties injecting the type properties attributes
    var extendDeviceProperties = function(device) {
      if (scope.refreshing) scope.device = scope.refreshing;                         // [hack] to not make the UI change while waiting for the response
      setRelativeTime();                                                             // set a 'time ago' date format
      if (scope.device.physical) scope.device.physical = scope.device.physical.uri;  // set the physical value that is used from the edit form
      extendResources(scope.device.properties, scope.type.properties);               // extend device properties with type properties
      scope.original = angular.copy(scope.device);                                   // device copy used for the edit clear form
    }

    var setRelativeTime = function() {
      scope.device.updated_at_relative = new Date(scope.device.updated_at).toRelativeTime(5000);
      $timeout(setRelativeTime, 60000);
    }

    // Extends the type functions properties injecting type properties
    var extendFunctionsProperties = function() {
      _.each(scope.functions, function(_function) {
        extendResources(_function.properties, scope.type.properties); // extends function.properties with type.properties
        _.each(_function.properties, function(property) {             // extends function.properties value with the device property value
          if (property.visible)                                       // if property is not visible it already has a default value
            property.value = findResource(property.id, scope.device.properties).value;
        });
      });
    };

    // Extends the type functions properties injecting the device value
    var initFunctionForms = function() {
      scope.functions = angular.copy(scope.type.functions); // copy all type functions in a local var (do not update type)
      _.each(scope.functions, function(_function) {
        // check which function properties need to be set as visible (if property value is empty)
        _.each(_function.properties, function(property) { property.visible = (property.value == null) });
        // check which functions need to be set as visible (if one property is visible)
        _function.hasForm = _.reduce(_function.properties, function(result, property) { return result || property.visible; }, false);
      });
    }

    // Extend a list of resources with an extended version.
    var extendResources = function(resources, fromResources) {
      _.each(resources, function(resource) {
        angular.extend(resource, findResource(resource.id, fromResources));
      });
    };

    // Returns the desired resource through its ID
    var findResource = function(id, resources) {
      var result = { id: 'undefined', name: 'Undefined' };
      result = _.find(resources, function(resource) { return resource.id == id })
      return result
    };

    // Find the device status
    // TODO Improve with a check on pending, value and expected
    var setDeviceStatus = function() {
      scope.status = { name: 'undefined' }
      _.each(scope.type.statuses, function(status) {
        _.each(status.properties, function(property) {
          var list   = property.values;
          var object = findResource(property.id, scope.device.properties).value;
          if (_.contains(list, object)) setStatus(status);
        });
      });
    };

    // Set the device status
    var setStatus = function(status) {
      scope.status = status;
      scope.status.function = findResource(scope.status.function.id, scope.functions);
    }

    // Close all open function forms
    var hideFunctionForms = function(exception_id) {
      _.each(scope.functions, function(_function) {
        if (_function.id != exception_id) _function.visible = false;
      });
    }

    // Events Emitter
    scope.fireOpen   = function() { $rootScope.$broadcast('lelylan:device:open', scope.device); };
    var fireDelete = function() { $rootScope.$broadcast('lelylan:device:delete', scope.device); };
    var fireRequestStart = function() { $rootScope.$broadcast('lelylan:device:request:start', scope.device); };
    var fireRequestEnd   = function() { $rootScope.$broadcast('lelylan:device:request:end', scope.device); };

    // Events Listener
    scope.$on('lelylan:device:request:start', function(event, device) { syncProperties(device) });
    scope.$on('lelylan:device:request:end', function(event, device) { syncProperties(device) });

    var syncProperties = function(device) {
      if (device.id == scope.device.id) {
        scope.device.properties = device.properties;
        scope.device.pending = device.pending;
        initResources(false);
      }
    }

    // Preloader
    var setPreloader = function() {
      var cl = new CanvasLoader('pending-' + scope.$id + '-' + scope.device.id);
      cl.setColor('#01cf9e'); // default is '#000000'
      cl.setDiameter(20); // default is 40
      cl.setDensity(70); // default is 40
      cl.setRange(0.7); // default is 1.3
      cl.setSpeed(2); // default is 2
      cl.setFPS(35); // default is 24
      cl.show(); // Hidden by default
    }
  };

  return definition
}]);

directives.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
}]);

/**
 * Returns a description of this date in relative terms.

 * Examples, where new Date().toString() == "Mon Nov 23 2009 17:36:51 GMT-0500 (EST)":
 *
 * new Date().toRelativeTime()
 * --> 'Just now'
 *
 * new Date("Nov 21, 2009").toRelativeTime()
 * --> '2 days ago'
 *
 * new Date("Nov 25, 2009").toRelativeTime()
 * --> '2 days from now'
 *
 * // One second ago
 * new Date("Nov 23 2009 17:36:50 GMT-0500 (EST)").toRelativeTime()
 * --> '1 second ago'
 *
 * toRelativeTime() takes an optional argument - a configuration object.
 * It can have the following properties:
 * - now - Date object that defines "now" for the purpose of conversion.
 *         By default, current date & time is used (i.e. new Date())
 * - nowThreshold - Threshold in milliseconds which is considered "Just now"
 *                  for times in the past or "Right now" for now or the immediate future
 * - smartDays - If enabled, dates within a week of now will use Today/Yesterday/Tomorrow
 *               or weekdays along with time, e.g. "Thursday at 15:10:34"
 *               rather than "4 days ago" or "Tomorrow at 20:12:01"
 *               instead of "1 day from now"
 *
 * If a single number is given as argument, it is interpreted as nowThreshold:
 *
 * // One second ago, now setting a now_threshold to 5 seconds
 * new Date("Nov 23 2009 17:36:50 GMT-0500 (EST)").toRelativeTime(100)
 * --> 'Just now'
 *
 * // One second in the future, now setting a now_threshold to 5 seconds
 * new Date("Nov 23 2009 17:36:52 GMT-0500 (EST)").toRelativeTime(5000)
 * --> 'Right now'
 *
 */
 Date.prototype.toRelativeTime = (function() {

  var _ = function(options) {
    var opts = processOptions(options);

    var now = opts.now || new Date();
    var delta = now - this;
    var future = (delta <= 0);
    delta = Math.abs(delta);

    // special cases controlled by options
    if (delta <= opts.nowThreshold) {
      return future ? 'Just now' : 'Just now';
    }
    if (opts.smartDays && delta <= 6 * MS_IN_DAY) {
      return toSmartDays(this, now);
    }

    var units = null;
    for (var key in CONVERSIONS) {
      if (delta < CONVERSIONS[key])
        break;
      units = key; // keeps track of the selected key over the iteration
      delta = delta / CONVERSIONS[key];
    }

    // pluralize a unit when the difference is greater than 1.
    delta = Math.floor(delta);
    if (delta !== 1) { units += "s"; }
    return [delta, units, future ? "from now" : "ago"].join(" ");
  };

  var processOptions = function(arg) {
    if (!arg) arg = 0;
    if (typeof arg === 'string') {
      arg = parseInt(arg, 10);
    }
    if (typeof arg === 'number') {
      if (isNaN(arg)) arg = 0;
      return {nowThreshold: arg};
    }
    return arg;
  };

  var toSmartDays = function(date, now) {
    var day;
    var weekday = date.getDay(),
        dayDiff = weekday - now.getDay();
    if (dayDiff == 0)       day = 'Today';
    else if (dayDiff == -1) day = 'Yesterday';
    else if (dayDiff == 1 && date > now)  day = 'Tomorrow';
    else                    day = WEEKDAYS[weekday];
    return day + " at " + date.toLocaleTimeString();
  };

  var CONVERSIONS = {
    millisecond: 1, // ms    -> ms
    second: 1000,   // ms    -> sec
    minute: 60,     // sec   -> min
    hour:   60,     // min   -> hour
    day:    24,     // hour  -> day
    month:  30,     // day   -> month (roughly)
    year:   12      // month -> year
  };
  var MS_IN_DAY = (CONVERSIONS.millisecond * CONVERSIONS.second * CONVERSIONS.minute * CONVERSIONS.hour * CONVERSIONS.day);

  var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return _;

})();



/*
 * Wraps up a common pattern used with this plugin whereby you take a String
 * representation of a Date, and want back a date object.
 */
Date.fromString = function(str) {
  return new Date(Date.parse(str));
};

(function(w){var k=function(b,c){typeof c=="undefined"&&(c={});this.init(b,c)},a=k.prototype,o,p=["canvas","vml"],f=["oval","spiral","square","rect","roundRect"],x=/^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,v=navigator.appVersion.indexOf("MSIE")!==-1&&parseFloat(navigator.appVersion.split("MSIE")[1])===8?true:false,y=!!document.createElement("canvas").getContext,q=true,n=function(b,c,a){var b=document.createElement(b),d;for(d in a)b[d]=a[d];typeof c!=="undefined"&&c.appendChild(b);return b},m=function(b,
c){for(var a in c)b.style[a]=c[a];return b},t=function(b,c){for(var a in c)b.setAttribute(a,c[a]);return b},u=function(b,c,a,d){b.save();b.translate(c,a);b.rotate(d);b.translate(-c,-a);b.beginPath()};a.init=function(b,c){if(typeof c.safeVML==="boolean")q=c.safeVML;try{this.mum=document.getElementById(b)!==void 0?document.getElementById(b):document.body}catch(a){this.mum=document.body}c.id=typeof c.id!=="undefined"?c.id:"canvasLoader";this.cont=n("div",this.mum,{id:c.id});if(y)o=p[0],this.can=n("canvas",
this.cont),this.con=this.can.getContext("2d"),this.cCan=m(n("canvas",this.cont),{display:"none"}),this.cCon=this.cCan.getContext("2d");else{o=p[1];if(typeof k.vmlSheet==="undefined"){document.getElementsByTagName("head")[0].appendChild(n("style"));k.vmlSheet=document.styleSheets[document.styleSheets.length-1];var d=["group","oval","roundrect","fill"],e;for(e in d)k.vmlSheet.addRule(d[e],"behavior:url(#default#VML); position:absolute;")}this.vml=n("group",this.cont)}this.setColor(this.color);this.draw();
m(this.cont,{display:"none"})};a.cont={};a.can={};a.con={};a.cCan={};a.cCon={};a.timer={};a.activeId=0;a.diameter=40;a.setDiameter=function(b){this.diameter=Math.round(Math.abs(b));this.redraw()};a.getDiameter=function(){return this.diameter};a.cRGB={};a.color="#000000";a.setColor=function(b){this.color=x.test(b)?b:"#000000";this.cRGB=this.getRGB(this.color);this.redraw()};a.getColor=function(){return this.color};a.shape=f[0];a.setShape=function(b){for(var c in f)if(b===f[c]){this.shape=b;this.redraw();
break}};a.getShape=function(){return this.shape};a.density=40;a.setDensity=function(b){this.density=q&&o===p[1]?Math.round(Math.abs(b))<=40?Math.round(Math.abs(b)):40:Math.round(Math.abs(b));if(this.density>360)this.density=360;this.activeId=0;this.redraw()};a.getDensity=function(){return this.density};a.range=1.3;a.setRange=function(b){this.range=Math.abs(b);this.redraw()};a.getRange=function(){return this.range};a.speed=2;a.setSpeed=function(b){this.speed=Math.round(Math.abs(b))};a.getSpeed=function(){return this.speed};
a.fps=24;a.setFPS=function(b){this.fps=Math.round(Math.abs(b));this.reset()};a.getFPS=function(){return this.fps};a.getRGB=function(b){b=b.charAt(0)==="#"?b.substring(1,7):b;return{r:parseInt(b.substring(0,2),16),g:parseInt(b.substring(2,4),16),b:parseInt(b.substring(4,6),16)}};a.draw=function(){var b=0,c,a,d,e,h,k,j,r=this.density,s=Math.round(r*this.range),l,i,q=0;i=this.cCon;var g=this.diameter;if(o===p[0]){i.clearRect(0,0,1E3,1E3);t(this.can,{width:g,height:g});for(t(this.cCan,{width:g,height:g});b<
r;){l=b<=s?1-1/s*b:l=0;k=270-360/r*b;j=k/180*Math.PI;i.fillStyle="rgba("+this.cRGB.r+","+this.cRGB.g+","+this.cRGB.b+","+l.toString()+")";switch(this.shape){case f[0]:case f[1]:c=g*0.07;e=g*0.47+Math.cos(j)*(g*0.47-c)-g*0.47;h=g*0.47+Math.sin(j)*(g*0.47-c)-g*0.47;i.beginPath();this.shape===f[1]?i.arc(g*0.5+e,g*0.5+h,c*l,0,Math.PI*2,false):i.arc(g*0.5+e,g*0.5+h,c,0,Math.PI*2,false);break;case f[2]:c=g*0.12;e=Math.cos(j)*(g*0.47-c)+g*0.5;h=Math.sin(j)*(g*0.47-c)+g*0.5;u(i,e,h,j);i.fillRect(e,h-c*0.5,
c,c);break;case f[3]:case f[4]:a=g*0.3,d=a*0.27,e=Math.cos(j)*(d+(g-d)*0.13)+g*0.5,h=Math.sin(j)*(d+(g-d)*0.13)+g*0.5,u(i,e,h,j),this.shape===f[3]?i.fillRect(e,h-d*0.5,a,d):(c=d*0.55,i.moveTo(e+c,h-d*0.5),i.lineTo(e+a-c,h-d*0.5),i.quadraticCurveTo(e+a,h-d*0.5,e+a,h-d*0.5+c),i.lineTo(e+a,h-d*0.5+d-c),i.quadraticCurveTo(e+a,h-d*0.5+d,e+a-c,h-d*0.5+d),i.lineTo(e+c,h-d*0.5+d),i.quadraticCurveTo(e,h-d*0.5+d,e,h-d*0.5+d-c),i.lineTo(e,h-d*0.5+c),i.quadraticCurveTo(e,h-d*0.5,e+c,h-d*0.5))}i.closePath();i.fill();
i.restore();++b}}else{m(this.cont,{width:g,height:g});m(this.vml,{width:g,height:g});switch(this.shape){case f[0]:case f[1]:j="oval";c=140;break;case f[2]:j="roundrect";c=120;break;case f[3]:case f[4]:j="roundrect",c=300}a=d=c;e=500-d;for(h=-d*0.5;b<r;){l=b<=s?1-1/s*b:l=0;k=270-360/r*b;switch(this.shape){case f[1]:a=d=c*l;e=500-c*0.5-c*l*0.5;h=(c-c*l)*0.5;break;case f[0]:case f[2]:v&&(h=0,this.shape===f[2]&&(e=500-d*0.5));break;case f[3]:case f[4]:a=c*0.95,d=a*0.28,v?(e=0,h=500-d*0.5):(e=500-a,h=
-d*0.5),q=this.shape===f[4]?0.6:0}i=t(m(n("group",this.vml),{width:1E3,height:1E3,rotation:k}),{coordsize:"1000,1000",coordorigin:"-500,-500"});i=m(n(j,i,{stroked:false,arcSize:q}),{width:a,height:d,top:h,left:e});n("fill",i,{color:this.color,opacity:l});++b}}this.tick(true)};a.clean=function(){if(o===p[0])this.con.clearRect(0,0,1E3,1E3);else{var b=this.vml;if(b.hasChildNodes())for(;b.childNodes.length>=1;)b.removeChild(b.firstChild)}};a.redraw=function(){this.clean();this.draw()};a.reset=function(){typeof this.timer===
"number"&&(this.hide(),this.show())};a.tick=function(b){var a=this.con,f=this.diameter;b||(this.activeId+=360/this.density*this.speed);o===p[0]?(a.clearRect(0,0,f,f),u(a,f*0.5,f*0.5,this.activeId/180*Math.PI),a.drawImage(this.cCan,0,0,f,f),a.restore()):(this.activeId>=360&&(this.activeId-=360),m(this.vml,{rotation:this.activeId}))};a.show=function(){if(typeof this.timer!=="number"){var a=this;this.timer=self.setInterval(function(){a.tick()},Math.round(1E3/this.fps));m(this.cont,{display:"block"})}};
a.hide=function(){typeof this.timer==="number"&&(clearInterval(this.timer),delete this.timer,m(this.cont,{display:"none"}))};a.kill=function(){var a=this.cont;typeof this.timer==="number"&&this.hide();o===p[0]?(a.removeChild(this.can),a.removeChild(this.cCan)):a.removeChild(this.vml);for(var c in this)delete this[c]};w.CanvasLoader=k})(window);
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i},w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var I=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=I(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&I(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return I(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n}),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return n===void 0},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};M.unescape=w.invert(M.escape);var S={escape:RegExp("["+w.keys(M.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(M.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(S[n],function(t){return M[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,w);var c=function(n){return e.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);