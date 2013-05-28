/* device-component-ng - v0.1.0 - 2013-05-27 */

'use strict';

angular.module('lelylan.components.device', [
  'lelylan',
  'lelylan.components.device.directive'
]);

'use strict';

// TODO(reggie) Apply a whole code refactoring to the javascript
// TODO(reggie) Set all classes to be independent using the prefix dc (*d*evice *c*omponent)
angular.module('lelylan.components.device.directive', [])

angular.module('lelylan.components.device.directive').directive('device', ['Device', 'Type', 'LoggedUser', '$rootScope', '$timeout',
  function(Device, Type, LoggedUser, $rootScope, $timeout) {

  var template =
    '<div class="device-component device-{{device.id}} type-{{type.id}}">' +
      '<div class="dc-main" ng-show="loaded">' +
        // Device header
        '<div class="dc-header">' +
          '<p class="dc-title lead" ng-show="!list">{{device.name}}</p>' +
          // Top menu
          '<div class="dc-menu" ng-show="menu">' +
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
            '<div class="dc-action">' +
              '<a href="javascript:" class="execute" title="{{status.function.name}}" ng-click="execute(status.function)"><span class="icon-lelylan-execute-big"></span></a>' +
              '<div ng-show="device.pending" id="pending-{{$id}}-{{device.id}}" class="pending"></div>' +
            '</div>' +
            '<div class="dc-description" ng-show="!list">' +
              '<p class="status lead">{{status.name}}</p>' +
              '<small class="dc-updated-from muted">{{device.updated_at_relative}} from {{device.updated_from}}</small>' +
            '</div>' +
            '<div class="dc-list-description" ng-show="list" ng-click="fireOpen()" ng-mouseover="entry=true" ng-mouseleave="entry=false">' +
              '<p class="lead color dc-name">{{device.name}}</p>' +
              '<p class="lead dc-status-name"><em>{{status.name}}</em></p>' +
              '<a ng-show="!entry" class="dc-open" href="javascript:"><span class="dc-details icon-lelylan-chevron"></span></a>' +
              '<a ng-show="entry" class="dc-open" href="javascript:"><span class="dc-details icon-lelylan-chevron-hover"></span></a>' +
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
                  '<a href="javascript:" class="execute" title="Execute {{function.name}}" ng-click="execute(function)">'+
                    '<span class="icon-lelylan-execute-small" ng-show="!function.hover"></span>' +
                    '<span class="icon-lelylan-execute-small-hover" ng-show="function.hover"></span>' +
                  '</a>' +
                  '<div class="dc-description">' +
                    '<p class="name lead"><a href="javascript:" ng-click="execute(function)" ng-mouseover="function.hover=true" ng-mouseleave="function.hover=false">{{function.name}}</a></p>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          // Properties
          '<div class="dc-properties">' +
            '<hr/>' +
            //'<p class="lead">Device Properties</p>' +
            '<div class="dc-property property-{{property.id}}" ng-repeat="property in device.properties">' +
              '<span class="name"><i class="icon-chevron-right"></i> {{property.name}}</span> ' +
              '<span class="expected color">{{property.accepted[property.expected] || property.expected}}</span>' +
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
                      '<small class="muted">Set {{property.name}} to {{property.expected}}</small><br/>' +
                      '<input type="{{property.type}}" min="{{property.range.min}}" max="{{property.range.max}}" step="{{property.range.step}}" ng-model="property.expected"></input>' +
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
          '<div class="dc-edit dc-form">' +
            '<hr/>' +
            '<div>' +
              '<p class="lead">Edit Device</p>' +
              '<form name="editForm">' +
                '<div class="control-group" ng-class="{error: editForm.name.$invalid}">' +
                  '<div class="input-prepend">' +
                    '<span class="add-on">Name</span>' +
                    '<input type="text" name="name" ng-model="device.name" required><br/>' +
                  '</div>' +
                  '<small ng-show="editForm.name.$error.required" class="help-inline">Required</small>' +
                '</div>' +
                '<div class="control-group" ng-class="{error: editForm.physical.uri.$invalid}" ng-show="user.id == device.maker.id">' +
                  '<div class="input-prepend">' +
                    '<span class="add-on">Physical</span>' +
                    '<input type="url" name="physical" ng-model="device.physical.uri"><br/>' +
                  '</div>' +
                  '<small ng-show="editForm.physical.$error.url" class="help-inline">Not a URL</small>' +
                '</div>' +
                '<div>' +
                  '<button ng-click="update()" ng-disabled="editForm.$invalid || editForm.$pristine" class="update btn"><i class="icon-pencil"></i> Update</button>' +
                  '<button ng-click="clear()" ng-disabled="editForm.$pristine" class="cancel btn"><i class="icon-refresh"></i> Reset</button>' +
                '</div>' +
              '</form>' +
            '</div>' +
          '</div>' +

          // Device information
          '<div class="dc-info dc-form" ng-show="user.id == device.maker.id">' +
            '<hr/>' +
            '<div>' +
              '<p class="lead">Device Information</p>' +
              '<form>' +
                '<div class="control-group">' +
                  '<div class="input-prepend">' +
                    '<span class="add-on">Type</span>' +
                    '<a ng-href="http://types.lelylan.com/types/{{type.id}}" target="blank">' +
                      '<input class="disabled clickable" name="physical" ng-model="device.name" disabled >' +
                    '</a><br/>' +
                  '</div>' +
                '</div>' +
                '<div class="control-group">' +
                  '<div class="input-prepend">' +
                    '<span class="add-on">URI</span>' +
                    '<input class="disabled" name="device-uri" ng-model="device.uri" disabled><br/>' +
                  '</div>' +
                '</div>' +
                '<div class="control-group">' +
                  '<div class="input-prepend">' +
                    '<span class="add-on">Secret</span>' +
                    '<input class="disabled" name="secret" ng-model="privates.secret" disabled><br/>' +
                  '</div>' +
                '</div>' +
              '</form>' +
            '</div>' +
          '</div>' +


          // Destroy device
          '<div class="dc-destroy dc-form" ng-show="user.id == device.maker.id">' +
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
      deviceMenu: '@',
    }
  };

  definition.link = function postLink(scope, element, attrs) {

    scope.action = { main: true };
    scope.loaded = false;
    scope.user   = LoggedUser.get();

    /* Watchers */
    scope.$watch('deviceId', function(value) {
      if (scope.deviceId)
        scope.device = Device.get({ id: scope.deviceId }, initialize);
    });

    scope.$watch('deviceJson', function(value, old) {
      if (scope.deviceJson) {
        scope.type   = null;
        scope.device = scope.deviceJson;
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

    scope.$watch('deviceMenu', function(value) {
      scope.menu = (scope.deviceMenu) ? scope.deviceMenu : true
      if (scope.deviceView == 'list' && !scope.deviceMenu) scope.menu = false;
    });

    // Component initialization.
    var initialize = function() {
      if (scope.deviceType) { scope.type = scope.deviceType } // HACK due to the fact that the type component could not be loaded yet
      (scope.type) ? initComponent() : scope.type = Type.get({ id: scope.device.type.id }, initComponent);
    };

    var initComponent = function() {
      initPrivates();            // get the private device info
      initFunctionForms();       // define the function form logic
      initResources();           // extend device.properties and function.each.properties
      $timeout(setPreloader, 0); // define the preloader
      scope.loaded = true;       // until the initialization part is not ended the component is not visible
    };

    // Extend device.properties and function.each.properties binding values.
    var initResources = function(internal) {
      if (scope.loaded && !internal)   // send an event when properties are updated
        fireRequestEnd();

      extendDeviceProperties();       // extende device properties with type properties
      extendFunctionsProperties();    // extende type functions properties with type properties
      setDeviceStatus();              // find the device status
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

    // Update the device
    scope.update = function() {
      scope.device.$update(function() {
        initResources();
        scope.showMain();
        scope.editForm.$setPristine();
      });
    };

    // Update the device properties
    scope.updateProperties = function(properties) {
      properties = prepareProperties(properties);
      var device = new Device({ id: scope.device.id, properties: properties});
      device.$properties({}, function() {
        scope.device = device;
        initResources()
      });

      extendResources(scope.device.properties, properties);
      scope.device.pending = true;
      fireRequestStart();
    };

    // Reload the device
    scope.refresh = function() {
      scope.device.pending = true;
      fireRequestStart();
      scope.refreshing = Device.get({ id: scope.device.id }, function() {
        scope.device = scope.refreshing;
        initResources();
      });
    };

    // Destroy the resource and hide the component
    scope.destroy = function() {
      scope.device.$delete(function() {
        fireDelete();
      })
    }

    scope.clear = function() {
      scope.device.name     = scope.original.name;
      scope.device.physical = scope.original.physical;
      scope.editForm.$setPristine();
    }

    // ----------------
    // Helper methods
    // ----------------

    // Get device private info
    var initPrivates = function() {
      scope.privates = Device.privates({ id: scope.device.id });
    }

    // Extends the device properties injecting the type properties attributes
    var extendDeviceProperties = function(device) {
      setRelativeTime();                                                // set a 'time ago' date format
      extendResources(scope.device.properties, scope.type.properties);  // extend device properties with type properties
      scope.original = angular.copy(scope.device);                      // device copy used for the edit clear form
    }

    var setRelativeTime = function() {
      scope.device.updated_at_relative = new Date(scope.device.updated_at).toRelativeTime(60000);
      if (scope.relative) return false
      scope.relative = true
      $timeout(setRelativeTime, 60000);
    }

    // Extends the type functions properties injecting type properties
    var extendFunctionsProperties = function() {
      _.each(scope.functions, function(_function) {
        extendResources(_function.properties, scope.type.properties); // extends function.properties with type.properties
        _.each(_function.properties, function(property) {             // extends function.properties value with the device property value
          if (property.visible)                                       // if property is not visible it already has a default value
            property.expected = findResource(property.id, scope.device.properties).expected;
        });
      });
    };

    // Extends the type functions properties injecting the device value
    var initFunctionForms = function() {
      scope.functions = angular.copy(scope.type.functions); // copy all type functions in a local var (do not update type)
      _.each(scope.functions, function(_function) {
        // check which function properties need to be set as visible (if property value is empty)
        _.each(_function.properties, function(property) { property.visible = (property.expected == null) });
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
          var object = findResource(property.id, scope.device.properties).expected;
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

    // Prepare properties to be sent with the correct values
    var prepareProperties = function(properties) {
      return _.map(properties, function(property) { return { id: property.id, pending: property.pending, expected: property.expected } });
    }


    /* Events Emitter */

    scope.fireOpen = function() {
      $rootScope.$broadcast('lelylan:device:open', scope.device);
    };

    var fireDelete = function() {
      $rootScope.$broadcast('lelylan:device:delete', scope.device);
    };

    var fireRequestStart = function() {
      $rootScope.$broadcast('lelylan:device:request:start', scope.device);
    };

    var fireRequestEnd = function() {
      $rootScope.$broadcast('lelylan:device:request:end', scope.device);
    };


    /* Events Listener */

    scope.$on('lelylan:device:request:start', function(event, device) {
      syncProperties(device)
    });

    scope.$on('lelylan:device:request:end', function(event, device) {
      syncProperties(device)
    });

    var syncProperties = function(device) {
      if (device.id == scope.device.id) {
        scope.device = device;
        initResources(true);
      }
    }


    /* Preloader */

    var setPreloader = function() {
      if (scope.preloader) return null;
      scope.preloader = true;

      var cl = new CanvasLoader('pending-' + scope.$id + '-' + scope.device.id);
      cl.setColor('#01cf9e');
      cl.setDiameter(20);
      cl.setDensity(70);
      cl.setRange(0.7);
      cl.setSpeed(2);
      cl.setFPS(35);
      cl.show();
    }
  };

  return definition
}]);

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
