angular.module('citizen-engagement.auth', ['angular-storage'])

  .service('AuthService', function(store) {

    var service = {
      currentUserId: store.get('currentUserId'),

      setUser: function(user) {
        service.currentUserId = user.userId;
        store.set('currentUserId', user.userId);
      },

      unsetUser: function() {
        service.currentUserId = null;
        store.remove('currentUserId');
      }
    };

    return service;
  })

  .factory('AuthInterceptor', function(AuthService) {
    return {
      request: function(config) {
        if (AuthService.currentUserId) {
          config.headers['X-User-Id'] = AuthService.currentUserId;
        }

        return config;
      }
    };
  })

  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  })

  .controller('LogoutCtrl', function(AuthService, $scope, $state) {
    $scope.logOut = function() {
      AuthService.unsetUser();
      $state.go('login');
    };
  })
;