/* lelylan-ng - v0.1.0 - 2013-04-30 */

'use strict';

angular.module('lelylan', [

  // client
  'lelylan.profile',
  'lelylan.device',
  'lelylan.history',
  'lelylan.activation',
  'lelylan.deactivation',
  'lelylan.type',
  'lelylan.property',
  'lelylan.function',
  'lelylan.status',
  'lelylan.location',
  'lelylan.subscription',
  'lelylan.category',

  // authorization
  'lelylan.loggedUser',
  'lelylan.accessToken',
  'lelylan.requestWrapper',
  'lelylan.basicAuth',
  'lelylan.basicRequestWrapper',
  'lelylan.implicitFlow',

  // configuration
  'lelylan.config',

  // requests flow
  'lelylan.requests',
  'lelylan.errors',

  // oauth components
  'lelylan.login'
]);

'use strict';

var client = angular.module('lelylan.activation', ['ngResource'])

client.factory('Activation', ['RequestWrapper', '$resource', 'lelylan.config', function(RequestWrapper, $resource, config) {

  var resource = $resource(
    config.endpoint + '/activations',
    { },
    { execute: { method: 'POST' } } );

  return RequestWrapper.wrap(resource, ['execute']);
}]);

'use strict';

// TODO Activation and deactivation must be in the same class the only problem is
// that we should make a personalized http call

var client = angular.module('lelylan.deactivation', ['ngResource'])

client.factory('Deactivation', ['RequestWrapper', '$resource', 'lelylan.config', function(RequestWrapper, $resource, config) {

  var resource = $resource(
    config.endpoint + '/activations/:activationCode',
    { activationCode: '@activation_code'},
    { execute: { method: 'DELETE' } } );

  return RequestWrapper.wrap(resource, ['execute']);
}]);

'use strict';

var client = angular.module('lelylan.device', ['ngResource']);

client.factory('Device', ['RequestWrapper', '$resource', 'lelylan.config', function(RequestWrapper, $resource, config) {

  var resource = $resource(
    config.endpoint + '/devices/:id/:action',
    { id: '@id' },
    { privates:   { method: 'GET', params: { action: 'privates' } },
      update:     { method: 'PUT' },
      properties: { method: 'PUT', params: { action: 'properties' } },
      execute:    { method: 'PUT', params: { action: 'functions' } } });

  return RequestWrapper.wrap(resource, ['get', 'privates', 'query', 'save', 'update', 'delete', 'properties', 'execute']);
}]);

'use strict';

var client = angular.module('lelylan.function', ['ngResource']);

client.factory('Function', ['RequestWrapper', '$resource', 'lelylan.config', function(RequestWrapper, $resource, config) {

  var resource = $resource(
    config.endpoint + '/functions/:id',
    { id: '@id' },
    { update: { method: 'PUT' },
      public: { method: 'GET', params: { id: 'public' }, isArray: true } }
  );

  return RequestWrapper.wrap(resource, ['get', 'query', 'save', 'update', 'delete']);
}]);

'use strict';

var client = angular.module('lelylan.history', ['ngResource'])

client.factory('History', ['RequestWrapper', '$resource', 'lelylan.config', function(RequestWrapper, $resource, config) {

  var resource = $resource(
    config.endpoint + '/histories/:id',
    { id: '@id' } );

  return RequestWrapper.wrap(resource, ['get', 'query']);
}]);

'use strict';

var client = angular.module('lelylan.location', ['ngResource']);

client.factory('Location', ['RequestWrapper', '$resource', 'lelylan.config', function(RequestWrapper, $resource, config) {

  var resource = $resource(
    config.endpoint + '/locations/:id',
    { id: '@id' },
    { update: { method: 'PUT' } } );

  return RequestWrapper.wrap(resource, ['get', 'query', 'save', 'update', 'delete']);
}]);

'use strict';

var client = angular.module('lelylan.profile', ['ngResource'])

client.factory('Profile', ['RequestWrapper', '$resource', 'lelylan.config', '$timeout',
  function(RequestWrapper, $resource, config, $timeout) {
    var me;
    var resource = $resource(config.endpoint + '/me');
    var profile  = RequestWrapper.wrap(resource, ['get']);

    return profile
}]);

'use strict';

var client = angular.module('lelylan.property', ['ngResource'])

client.factory('Property', ['RequestWrapper', '$resource', 'lelylan.config', function(RequestWrapper, $resource, config) {

  var resource = $resource(
    config.endpoint + '/properties/:id',
    { id: '@id' },
    { update: { method: 'PUT' },
      public: { method: 'GET', params: { id: 'public' }, isArray: true } } );

  return RequestWrapper.wrap(resource, ['get', 'query', 'save', 'update', 'delete']);
}]);

'use strict';

var client = angular.module('lelylan.status', ['ngResource'])

client.factory('Status', ['RequestWrapper', '$resource', 'lelylan.config', function(RequestWrapper, $resource, config) {

  var resource = $resource(
    config.endpoint + '/statuses/:id',
    { id: '@id' },
    { update: { method: 'PUT' },
      public: { method: 'GET', params: { id: 'public' }, isArray: true } } );

  return RequestWrapper.wrap(resource, ['get', 'query', 'save', 'update', 'delete']);
}]);

'use strict';

var client = angular.module('lelylan.subscription', ['ngResource'])

client.factory('Subscription', ['BasicRequestWrapper', '$resource', 'lelylan.config', function(BasicRequestWrapper, $resource, config) {

  var resource = $resource(
    config.endpoint + '/subscriptions/:id',
    { id: '@id' },
    { update: { method: 'PUT' } } );

  return BasicRequestWrapper.wrap(resource, ['get', 'query', 'save', 'update', 'delete']);
}]);

'use strict';

var client = angular.module('lelylan.category', ['ngResource']);

client.factory('Category', ['RequestWrapper', '$resource', 'lelylan.config', function(RequestWrapper, $resource, config) {
  var resource = $resource(config.endpoint + '/categories');
  return RequestWrapper.wrap(resource, ['query']);
}]);

'use strict';

var client = angular.module('lelylan.type', ['ngResource']);

client.factory('Type', ['RequestWrapper', '$resource', 'lelylan.config', function(RequestWrapper, $resource, config) {

  var resource = $resource(
    config.endpoint + '/types/:id',
    { id: '@id' },
    { update: { method: 'PUT' },
      public: { method: 'GET', params: { id: 'public' }, isArray: true },
      popular: { method: 'GET', params: { id: 'popular' }, isArray: true }} );

  return RequestWrapper.wrap(resource, ['get', 'query', 'save', 'update', 'delete']);
}]);

'use strict';

var client = angular.module('lelylan.loggedUser', []);

client.factory('LoggedUser', ['$location', '$http', function($location, $http) {
  var service = {};
  var user = {};

  // Returns the access token
  service.get = function() {
    return user;
  };

  // Set the access token from the fragment URI
  service.set = function(_user) {
    return user = _user;
  };

  return service;
}]);

'use strict';

var client = angular.module('lelylan.basicRequestWrapper', ['ngResource'])

client.factory('BasicRequestWrapper', ['BasicAuth', 'Base64', '$http', function(BasicAuth, Base64, $http) {
  var requestWrapper = {};

  requestWrapper.wrap = function(resource, actions, options) {
    var wrappedResource = resource;
    for (var i=0; i < actions.length; i++) { request(wrappedResource, actions[i]); };
    return wrappedResource;
  };

  var request = function(resource, action) {
    resource['_' + action] = resource[action];

    resource[action] = function(params, data, success, error) {
      (BasicAuth.get().clientID && BasicAuth.get().clientSecret) ? setAuthorizationHeader() : deleteAuthorizationHeader();
      return resource['_' + action].call(this, params, data, success, error);
    };
  };

  var setAuthorizationHeader = function() {
    var basic = BasicAuth.get();
    $http.defaults.headers.common['Authorization'] = Base64.encode(basic.clientID + ':' + basic.clientSecret);
  };

  var deleteAuthorizationHeader = function() {
    delete $http.defaults.headers.common['Authorization']
  };

  return requestWrapper;
}]);

'use strict';

var client = angular.module('lelylan.basicAuth', ['ngResource'])

client.factory('BasicAuth', [function() {
  var basicAuth = {};
  var auth = {};

  basicAuth.get = function() { return auth };
  basicAuth.set = function(params) { angular.extend(auth, params) };

  return basicAuth;
}]);

client.factory('Base64', [function() {
  var base64 = {};
  var cb64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  base64.encode = function(str) {
    var tmpvar,i,str,j;
    var resultstr;
    i=str.length;
    j=0;
    resultstr="";
    while(i>0){
      if (i>2){
        tmpvar=str.substr(j,3)
        resultstr = resultstr + encodeBlock(tmpvar,3);
      }else{
        tmpvar=str.substr(j,i)
        resultstr = resultstr + encodeBlock(tmpvar,i);
      }
      i-=3;
      j+=3;
    }
    return resultstr;
  };

  var encodeBlock = function(instr, len) {
    var out=new Array(4);
    var in0,in1,in2,in3;
    in0=instr.charCodeAt(0);
    out[0]=cb64.charAt(in0 >> 2);
    if (len < 2){
      in1=0;
      in2=0;
      in3=0;
    }else{
      in1=instr.charCodeAt(1);
      if (len<3){
        in2=0;
        in3=0;
      }else{
        in2=instr.charCodeAt(2);
        in3=instr.charCodeAt(3);
      }
    }
    out[1]=cb64.charAt( ((in0 & 0x03) << 4)| ((in1 & 0xf0) >> 4));
    if (len>1){
      out[2] = cb64.charAt( ((in1 & 0x0f) << 2) | ((in2 & 0xc0) >> 6) );
    }else{
      out[2] = '=';
    }
    if (len>2){
      out[3] = cb64.charAt(in2 & 0x3f);
    }else{
      out[3] = '=';
    }
    return(out[0] + out[1] + out[2] + out[3]);
  }

  return base64;
}]);


'use strict';

var client = angular.module('lelylan.requestWrapper', ['ngResource']);

client.factory('RequestWrapper', ['AccessToken', 'ImplicitFlow', '$http', function(AccessToken, ImplicitFlow, $http) {
  var requestWrapper = {};
  var token;

  requestWrapper.wrap = function(resource, actions, options) {
    token = AccessToken.initialize();
    var wrappedResource = resource;
    for (var i=0; i < actions.length; i++) { request(wrappedResource, actions[i]); };
    return wrappedResource;
  };

  var request = function(resource, action) {
    resource['_' + action] = resource[action];

    resource[action] = function(params, data, success, error) {
      (AccessToken.get().access_token) ? setAuthorizationHeader() : deleteAuthorizationHeader();
      if (token.expires_at && token.expires_at < new Date()) window.location.replace(ImplicitFlow.url());
      return resource['_' + action].call(this, params, data, success, error);
    };
  };

  var setAuthorizationHeader = function() {
    $http.defaults.headers.common['Authorization'] = 'Bearer ' + token.access_token;
  };

  var deleteAuthorizationHeader = function() {
    delete $http.defaults.headers.common['Authorization']
  };

  return requestWrapper;
}]);

'use strict';

var client = angular.module('lelylan.accessToken', ['ngResource']);

client.factory('AccessToken', ['$location', '$http', function($location, $http) {
  var accessToken = {};
  var token = {};

  // Returns the access token
  accessToken.get = function() {
    return token
  }

  // Set the access token from the fragment URI
  accessToken.initialize = function() {
    var hash = accessToken.parseToken();
    if (hash.access_token) accessToken.set(hash);
    if (hash.error) accessToken.set(hash);
    return token
  };

  // Set the access token
  accessToken.set = function(params) {
    angular.extend(token, params);
    setExpiresAt();
    return token;
  };

  // Remove the access token authorization header
  accessToken.delete = function() {
    token = {};
  }

  // Get the access token from the fragment URI
  accessToken.parseToken = function() {
    var result = {};
    var splitted = $location.hash().split('&');
    for (var i = 0; i < splitted.length; i++) {
      var param = splitted[i].split('=');
      var key = param[0]; var value = param[1];
      result[key] = value };

    return result;
  };

  // Set the access token expiration date (useful for refresh logics)
  var setExpiresAt = function() {
    var expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + parseInt(token.expires_in) - 60); // 60 seconds less to secure browser and response latency
    token.expires_at = expires_at;
  };

  return accessToken;
}]);

'use strict';

var client = angular.module('lelylan.implicitFlow', ['ngResource']);

// TODO Here we must set the initial Implicit Flow data (init)
client.factory('ImplicitFlow', ['AccessToken', '$location', function(AccessToken, $location) {
  var implicitFlow = {};
  var params;

  // Define the authorization URL
  implicitFlow.url = function(newParams) {
    if (newParams) { params = newParams; }

    return params.site +
      params.authorizePath +
      '?response_type=token&' +
      'client_id=' + params.client + '&' +
      'redirect_uri=' + params.redirect + '&' +
      'scope=' + params.scope + '&' +
      'state=' + params.state + joiner + encode($location.url());
  }

  // Restore the exact URL existing before the authorization
  implicitFlow.restoreURL = function(scope) {
    if (AccessToken.get().state) {
      var state = AccessToken.get().state.split(joiner);
      if (state[0]) AccessToken.set({ state: state[0] });
      if (state[1]) $location.url(decode(state[1]));
      scope.endpoint = implicitFlow.url(scope);
    }
  }

  // Little hacking encoding (otherwise we are not able to restore the
  // URL before the implicit token request)
  var joiner = '5c6007a2', equal = 'e9e08740', sharp = '008e974e', amper = 'c1384ea1';
  var encode = function(value) { return value.replace(/=/g, equal).replace(/#/g, sharp).replace(/&/g, amper); }
  var decode = function(value) { return value.replace(/e9e08740/g, '=').replace(/008e974e/g, '#').replace(/c1384ea1/g, '&'); }

  return implicitFlow;
}]);

// Inspired by https://github.com/witoldsz/angular-http-auth/blob/master/src/angular-http-auth.js
angular.module('lelylan.errors', [])
  .config(['$httpProvider', function($httpProvider) {

  var statusCodes = {
      400: "Bad Request",
      401: "Unauthorized",
      402: "Payment Required",
      403: "Forbidden",
      404: "Not Found",
      405: "Method Not Allowed",
      406: "Not Acceptable",
      407: "Proxy Authentication Required",
      408: "Request Timeout",
      409: "Conflict",
      410: "Gone",
      411: "Length Required",
      412: "Precondition Failed",
      413: "Request Entity Too Large",
      414: "Request-URI Too Long",
      415: "Unsupported Media Type",
      416: "Requested Range Not Satisfiable",
      417: "Expectation Failed",
      420: "Enhance Your Calm",
      422: "Unprocessable Entity",
      423: "Locked",
      424: "Failed Dependency",
      425: "Unordered Collection",
      426: "Upgrade Required",
      428: "Precondition Required",
      429: "Too Many Requests",
      431: "Request Header Fields Too Large",
      444: "No Response",
      449: "Retry With",
      499: "Client Closed Request",
      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
      505: "HTTP Version Not Supported",
      506: "Variant Also Negotiates",
      507: "Insufficient Storage",
      508: "Loop Detected",
      509: "Bandwidth Limit Exceeded",
      510: "Not Extended",
      511: "Network Authentication Required"
    };

    var interceptor = ['$rootScope', '$q', function($rootScope, $q) {
      function success(response) { return response; }
      function error(response) {
        if (response.status >= 400) {
          var error =  { status: response.status, message: statusCodes[response.status] };
          $rootScope.$broadcast('lelylan:error', error);
          $rootScope.$broadcast('lelylan:error:' + response.status, error);
          var deferred = $q.defer();
          return deferred.promise;
        };
        return $q.reject(response);
      };
      return function(promise) { return promise.then(success, error); }
    }];

    $httpProvider.responseInterceptors.push(interceptor);
  }]);


angular.module('lelylan.requests', [])
.config(['$httpProvider', function($httpProvider) {
  var $http, interceptor = ['$q', '$injector', function ($q, $injector) {
    var requestError;

    var toggle = function(id, action) {
      if (window.document.getElementById(id)) {
        window.document.getElementById(id).style.display = action;
      }
    }

    function success(response) {
      $http = $http || $injector.get('$http'); // HACK: get $http via $injector because of circular dependency problem
      if ($http.pendingRequests.length < 1) {
        toggle('lelylan-request-loading', 'none');
      }
      return response;
    }

    function requesterror(response) {
      $http = $http || $injector.get('$http'); // HACK: get $http via $injector because of circular dependency problem
      if ($http.pendingRequests.length < 1) {
        toggle('lelylan-request-loading', 'none');
        toggle('lelylan-request-error', 'none');
      };
      return $q.reject(response);
    }

    return function (promise) {
      toggle('lelylan-request-loading', 'block')
      return promise.then(success, requestError);
    }
  }];

  $httpProvider.responseInterceptors.push(interceptor);
}]);

'use strict';

angular.module('lelylan.config', []).value('lelylan.config', {
  endpoint: 'http://api.lelylan.com'
});

'use strict';

var directives = angular.module('lelylan.login', ['ngCookies'])

directives.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');;
}]);

directives.directive('login', ['AccessToken', 'ImplicitFlow', 'Profile', 'LoggedUser', '$location', '$cookies', '$rootScope',
  function(AccessToken, ImplicitFlow, Profile, LoggedUser, $location, $cookies, $rootScope) {

  var template =
    '<ul class="nav pull-right">' +
      '<li ng-show="show==\'out\'" class="login">' +
        '<a ng-href="{{endpoint}}">{{value || \'Sign In\'}}</a>' +
      '</li>' +
      '<li ng-show="show==\'in\'" class="logout">' +
        '<a ng-click="logout()">Logout {{profile.email}}</a>' +
      '</li>' +
    '</ul>';

  var definition = {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: template,
    scope: {
      site: '@',
      client: '@',
      redirect: '@',
      scope: '@',
      state: '@',
      flow: '@',
      value: '@'
    }
  };

  definition.link = function postLink(scope, element, attrs) {

    scope.$watch('client', function(value) {
      initialize();
      var token = AccessToken.initialize();

      // Always login when there is the access token
      if (token.access_token) return scope.login();
      // Callback denying access token in the fragment URI
      if (token.error) return scope.deny();
      // First time on page (logged out)
      if (!getCookie() && !token.access_token && !token.error) return scope.logout();
      // Logged in refreshed page (need to redirect to oauth page)
      if (getCookie() && !token.access_token && !token.error) return scope.authorize();
    });

    scope.login = function() {
      showLogin();
      ImplicitFlow.restoreURL(scope);
      scope.profile = LoggedUser.set(Profile.get());
      setCookie('logged-in');
      fireLoginEvent();
    };

    scope.logout = function() {
      clear();
      fireLogoutEvent();
    };

    scope.deny = function() {
      clear();
      fireDeniedEvent();
    };

    scope.authorize = function() {
      window.location.replace(scope.endpoint);
    };

    var clear = function() {
      showLogout();
      deleteCookie();
      scope.profile = LoggedUser.set(null);
      AccessToken.delete();
    };

    var initialize = function() {
      scope.site = scope.site || 'http://people.lelylan.com';
      scope.flow = scope.flow || 'implicit';
      scope.authorizePath = scope.authorizePath || '/oauth/authorize';
      scope.tokenPath = scope.tokenPath || '/oauth/token';
      scope.scope = scope.scope || 'user';
      scope.endpoint = ImplicitFlow.url(scope);
    };

    var showLogin  = function() { scope.show = 'in'; }
    var showLogout = function() { scope.show = 'out'; }

    var getCookie    = function() { return $cookies[scope.client]; };
    var setCookie    = function(value) { $cookies[scope.client] = value; };
    var deleteCookie = function() {
      delete $cookies[scope.client];
      delete $cookies['#!' + scope.client]; // hack to let the cookie being deleted with bang uri http://svel.to/65c
    };


    var fireLoginEvent  = function() { $rootScope.$broadcast('lelylan:login', AccessToken.get()); }
    var fireDeniedEvent = function() { $rootScope.$broadcast('lelylan:login:denied'); }
    var fireLogoutEvent = function() { $rootScope.$broadcast('lelylan:logout'); }
  };

  return definition
}]);
