'use strict';

angular.module('lelylan.directives.type', [
  'lelylan.client',
  'lelylan.directives.type.directive',
  'ngTouch',
  'ngAnimate',
  'ngClipboard'
])
.config(['ngClipProvider', function(ngClipProvider) {
  ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
}]);


'use strict';

angular.module('lelylan.directives.type.directive', [])

angular.module('lelylan.directives.type.directive').directive('lelylanType',

  function(
    $rootScope,
    $timeout,
    $compile,
    $templateCache,
    $http,
    Profile,
    Type,
    Property,
    Function,
    Status,
    Category
  ) {

  var definition = {
    restrict: 'EA',
    replace: true,
    scope: {
      typeId: '@',
      typeTemplate: '@'
    }
  };

  definition.link = function(scope, element, attrs) {

    /*
     * CONFIGURATIONS
     */

    // active view
    scope.view = { path: '/loading' }

    // active connection
    scope.connection = 'properties';

    // template
    scope.template = attrs.typeTemplate || 'bower_components/type-directive-ng/dist/views/templates/default.html';

    // property types
    scope.config = {
      property: {
        types: {
          'text': 'text',
          'number': 'number',
          'range': 'range',
          'color': 'color',
          'password': 'password',
          'date': 'date',
          'time': 'time',
          'datetime': 'datetime',
          'url': 'url'
        }
      }
    };


    /*
     * DYNAMIC LAYOUT
     */

    var compile = function() {
      $http.get(scope.template, { cache: $templateCache }).success(function(html) {
        element.html(html);
        $compile(element.contents())(scope);
      });
    }

    compile();


    /*
     * API REQUESTS
     */

    /* watches the device ID and gets the device representation and calls the type API */
    scope.$watch('typeId', function(value) {
      if (value) {
        Type.find(value).
          success(function(response) {
            scope.view.path = '/default';
            scope.type = response;
          }).
          error(function(data, status) {
            scope.view.path = '/message';
            scope.message   = { title: 'Something went wrong', description: 'Most probably the type you are trying to load does not exist' }
          });

        Category.all().
          success(function(response) {
            scope.categories = response;
          });
      }
    });


    /*
     * GENERIC BEHAVIOUR
     */

    /* open and close one connection */
    scope.toggle = function(connection) {
      connection.open = !connection.open;
    }

    /* check if the owner is logged in */
    scope.isOwner = function() {
      return (Profile.get() && Profile.get().id == scope.type.owner.id);
    }

    /* default visualization */
    scope.showDefault = function() {
      scope.view.path = '/default';
    }

    /* set the visible connection (properties, functions, status or category) */
    scope.setConnection = function(connection) {
      scope.connection = connection;
      scope.showDefault();
    }


    /*
     * PROPERTY BEHAVIOUR
     */

    scope.addProperty = function() {
      Property.create({name: 'New', type: 'text'}).
        success(function(response) {
          response.open = true;
          scope.type.properties.unshift(response);
          var properties = _.pluck(scope.type.properties, 'id')
          Type.update(scope.type.id, { properties: properties });
        });
    }

    scope.updateProperty = function(property, form) {
      property.status = 'Saving';
      Property.update(property.id, property).
        success(function(response) {
          $timeout(function() {
            property.status = null;
            form.$setPristine()
          }, 500);
        }).
        error(function(data, status) {
          scope.view.path = '/message';
          scope.message = { title: 'Something went wrong', description: 'There was a problem while saving the resource.' }
        });
    }

    /* remove one element to the list of the accepted elements */
    scope.removeAccepted = function(property, index, form) {
      delete property.accepted.splice(index, 1);
      form.$setDirty(); // bug (the dirty is not activated otherwise)
    }

    /* add one element to the list of the accepted elements */
    scope.addAccepted = function(property) {
      if (!property.accepted) { property.accepted = [] }
      property.accepted.push({key: '', value: ''});
    }


    /*
     * FUNCTION BEHAVIOUR
     */

    scope.addFunction = function() {
      Function.create({name: 'New'}).
        success(function(response) {
          response.open = true;
          scope.type.functions.unshift(response);
          var functions = _.pluck(scope.type.functions, 'id')
          Type.update(scope.type.id, { functions: functions });
        });
    }

    scope.updateFunction = function(_function, form) {
      _function.status = 'Saving';
      Function.update(_function.id, _function).
        success(function(response) {
          $timeout(function() {
            _function.status = null;
            form.$setPristine()
          }, 500);
        }).
        error(function(data, status) {
          scope.view.path = '/message';
          scope.message = { title: 'Something went wrong', description: 'There was a problem while saving the resource.' }
        });
    }

    /* remove one element to the list of the effected properties */
    scope.removeFunctionProperty = function(_function, index, form) {
      delete _function.properties.splice(index, 1);
      form.$setDirty(); // bug (the dirty is not activated otherwise)
    }

    /* add one element to the list of the effected properties */
    scope.addFunctionProperty = function(_function) {
      _function.properties.push({ id: '', value: ''});
    }


    /*
     * STATUSES BEHAVIOUR
     */

    scope.addStatus = function() {
      Status.create({ name: 'New'}).
        success(function(response) {
          response.open = true;
          scope.type.statuses.unshift(response);
          var statuses = _.pluck(scope.type.statuses, 'id')
          Type.update(scope.type.id, { statuses: statuses });
        });
    }

    scope.updateStatus = function(status, form) {
      status.status = 'Saving';

      // normalize status property values to be array
      _.each(status.properties, function(property) {
        if ((typeof property.values) == 'string') {
          property.values = property.values.replace(/ /g,'');
          property.values = property.values.split(',')
        }
      });

      Status.update(status.id, status).
        success(function(response) {
          $timeout(function() {
            status.status = null;
            form.$setPristine()
          }, 500);
        }).
        error(function(data, status) {
          scope.view.path = '/message';
          scope.message = { title: 'Something went wrong', description: 'There was a problem while saving the resource.' }
        });
    }

    /* remove one element to the list of the accepted elements */
    scope.removeStatusProperty = function(status, index, form) {
      delete status.properties.splice(index, 1);
      form.$setDirty(); // bug (the dirty is not activated otherwise)
    }

    /* add one element to the list of the accepted elements */
    scope.addStatusProperty = function(status) {
      status.properties.push({ id: '', values: []});
    }


    /*
     * CATEGORY BEHAVIOUR
     */

    scope.updateCategory = function(category) {
      if (scope.isOwner()) {
        scope.type.category = category;
        Type.update(scope.type.id, { category: category }).
          error(function() {
            scope.view.path = '/message';
            scope.message = { title: 'Something went wrong', description: 'There was a problem while saving the resource.' }
          });
      }
    }


    /*
     * TYPE BEHAVIOUR
     */

    scope.updateType = function(form) {
      scope.type.status = 'Saving';
      scope.showDefault();
      Type.update(scope.type.id, { name: scope.type.name } ).
        success(function(response) {
          scope.type.name = response.name;
          $timeout(function() {
            form.$setPristine();
            scope.type.status = null;
          }, 500)
        }).
        error(function() {
          scope.view.path = '/message';
          scope.message = { title: 'Something went wrong', description: 'There was a problem while saving the resource.' }
        });
    }

    scope.deleteType = function(confirm) {
      if (scope.type.name == confirm) {
        scope.view.path = '/message';
        scope.message = { title: 'Type deleted', description: 'Reload the page to update the view' }
        Type.delete(scope.type.id).
          success(function(response) {
            scope.type = response;
            $rootScope.$broadcast('lelylan:type:delete', response);
          });
      }
    }


    /*
     * CONNECTION DELETION BEHAVIOUR
     */

    scope.confirmDeleteConnection = function(connection, index, name) {
      scope.blocking = getBlocking(connection, name);

      scope.deleting = { connection: connection, index: index, name: name };
      if (scope.deleting.name == 'properties') { scope.deleting.klass = Property }
      if (scope.deleting.name == 'functions')  { scope.deleting.klass = Function }
      if (scope.deleting.name == 'statuses')   { scope.deleting.klass = Status }
      scope.view.path = '/delete' ;
    }

    // check if the connection is used from other connections
    // * check if a property is used from functions or statuses
    // * check if a function is used from statuse
    var getBlocking = function(connection, name) {
      var resources = {
        functions: [],
        statuses: []
      }

      if (name == 'properties') {
        _.each(scope.type.functions, function(_function) {
          var ids = _.pluck(_function.properties, 'id');
          if (_.contains(ids, connection.id)) { resources.functions.push(_function.name) }
        });
      }

      if (name == 'properties') {
        _.each(scope.type.statuses, function(status) {
          var ids = _.pluck(status.properties, 'id');
          if (_.contains(ids, connection.id)) { resources.statuses.push(status.name) }
        });
      }

      if (name == 'functions') {
        _.each(scope.type.statuses, function(status) {
          if (status.function.id == connection.id) { resources.statuses.push(status.name) }
        });
      }

      return resources;
    };

    scope.deleteConnection = function(confirm) {
      if (scope.deleting.connection.name == confirm) {

        var klass      = scope.deleting.klass;
        var connection = scope.deleting.connection;
        var index      = scope.deleting.index;
        var name       = scope.deleting.name;

        scope.deleting.klass.delete(connection.id).
          success(function(response) {
            scope.type[name].splice(index, 1);
            var connections = _.pluck(scope.type[name], 'id');
            var params = {};
            params[name] = _.pluck(scope.type[name], 'id');
            Type.update(scope.type.id, params);
            scope.showDefault();
          });
      }
    };

    // copy embedded code
    scope.copyEmbed = function() {
      scope.messageEmbed = 'Copied'
      $timeout(function() { scope.messageEmbed = null; }, 2000);
      return document.getElementById('embed').innerHTML;
    };

  }

  return definition
});
