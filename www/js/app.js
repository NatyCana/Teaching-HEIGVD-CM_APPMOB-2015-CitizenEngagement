// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('citizen-engagement', ['ionic', 'citizen-engagement.auth', 'citizen-engagement.constants', "leaflet-directive", "geolocation", 'ui.router'])

        .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
        .config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS


})

        /*///////////////////////////////////////*/
        /*///////////////SERVICE//PHOTO//////////*/
        /*///////////////////////////////////////*/

        .factory("CameraServie", function($q) {
    return{
        getPicture: function(options) {
            var deferred = $q.defer();
            navigator.camera.getPicture(function(result) {
                deferred.resolve(result);
            }, function(err) {
                deferre.reject(err);
            }, options);
            return deferred.promise;
        }
    }

})
        .config(function($stateProvider, $urlRouterProvider) {



    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

            // This is the abstract state for the tabs directive.
            .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

            // The three next states are for each of the three tabs.
            // The state names start with "tab.", indicating that they are children of the "tab" state.
            .state('tab.newIssue', {
        // The URL (here "/newIssue") is used only internally with Ionic; you never see it displayed anywhere.
        // In an Angular website, it would be the URL you need to go to with your browser to enter this state.
        url: '/newIssue',
        views: {
            // The "tab-newIssue" view corresponds to the <ion-nav-view name="tab-newIssue"> directive used in the tabs.html template.
            'tab-newIssue': {
                // This defines the template that will be inserted into the directive.
                templateUrl: 'templates/newIssue.html',
                controller: "NewIssue"
            }
        }
    })
            //State ISSUEMAP
            .state('tab.issueMap', {
        url: '/issueMap',
        views: {
            'tab-issueMap': {
                templateUrl: 'templates/issueMap.html',
                controller: "MapController"
            }
        }
    })
            //State ISSUELIST
            .state('tab.issueList', {
        url: '/issueList',
        views: {
            'tab-issueList': {
                templateUrl: 'templates/issueList.html',
                controller: "GetIssues"
            }
        }
    })
            //State LOGIN
            .state('login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'templates/login.html'
    })

            //State ISSUEDETAILS
            // This is the issue details state.
            .state('tab.issueDetails', {
        // We use a parameterized route for this state.
        // That way we'll know which issue to display the details of.
        url: '/issueDetails/:issueId',
        views: {
            // Here we use the same "tab-issueList" view as the previous state.
            // This means that the issue details template will be displayed in the same tab as the issue list.
            'tab-issueList': {
                controller: 'GetIssueDetails',
                templateUrl: 'templates/issueDetails.html'
            }
        },
        controller: "GetIssueDetails"
    })

            ;

    // Define the default state (i.e. the first screen displayed when the app opens).
    $urlRouterProvider.otherwise(function($injector) {
        $injector.get('$state').go('tab.newIssue'); // Go to the new issue tab by default.
    });
})
        .run(function(AuthService, $rootScope, $state) {

    // Listen for the $stateChangeStart event of AngularUI Router.
    // This event indicates that we are transitioning to a new state.
    // We have the possibility to cancel the transition in the callback function.
    $rootScope.$on('$stateChangeStart', function(event, toState) {

        // If the user is not logged in and is trying to access another state than "login"...
        if (!AuthService.currentUserId && toState.name != 'login') {

            // ... then cancel the transition and go to the "login" state instead.
            event.preventDefault();
            $state.go('login');
        }
    });
})
        .controller('LoginCtrl', function(apiUrl, AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state) {

    // The $ionicView.beforeEnter event happens every time the screen is displayed.
    $scope.$on('$ionicView.beforeEnter', function() {
        // Re-initialize the user object every time the screen is displayed.
        // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.
        $scope.user = {};
    });

    // Add the register function to the scope.
    $scope.register = function() {

        // Forget the previous error (if any).
        delete $scope.error;

        // Show a loading message if the request takes too long.
        $ionicLoading.show({
            template: 'Logging in...',
            delay: 750
        });

        // Make the request to retrieve or create the user.
        $http({
            method: 'POST',
            url: apiUrl + '/users/logister',
            data: $scope.user
        }).success(function(user) {

            // If successful, give the user to the authentication service.
            AuthService.setUser(user);

            // Hide the loading message.
            $ionicLoading.hide();

            // Set the next view as the root of the history.
            // Otherwise, the next screen will have a "back" arrow pointing back to the login screen.
            $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
            });

            // Go to the issue creation tab.
            $state.go('tab.newIssue');

        }).error(function() {

            // If an error occurs, hide the loading message and show an error message.
            $ionicLoading.hide();
            $scope.error = 'Could not log in.';
        });
    };
})
        .controller('LogoutCtrl', function(AuthService, $scope, $state) {
    $scope.logOut = function() {
        AuthService.unsetUser();
        $state.go('login');
    };
})
        .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
})

        .controller("MapController", function($scope, mapboxMapId, mapboxAccessToken, geolocation) {
    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
    $scope.mapDefaults = {
        tileLayer: mapboxTileLayer
    };
    $scope.mapCenter = {
        lat: 51.48,
        lng: 0,
        zoom: 14
    };
    $scope.mapMarkers = [];

    /*geolocation
     geolocation.getLocation().then(function(data){
     $scope.mapCenter.lat =data.coords.latitude;
     $scope.mapCenter.lng =data.coords.longitude;
     }, function(error) {
     $log.error("Could not get location:" + error);
     });      */
})

        /*///////////////////////////////////GetIssueType///////////////////////////////////////////////*/
        .controller("GetIssueType", function($scope, $http, apiUrl) {
    $scope.items = [];
    $http({
        method: 'GET',
        url: apiUrl + '/issueTypes'
    })
            .success(function(data) {
        $scope.items = data;
    })
            .error(function(data) {
        console.log("Error");
    });
})

        .controller("IssuesListTabController", function($scope, $state) {
    $scope.onTabSelected = function() {
        console.log("user has clicked on Issues List tab");
        $state.go('tab.issueList');
    }
})

        /*///////////////////////////////////GetIssues///////////////////////////////////////////////*/
        .controller("GetIssues", function($scope, $http, apiUrl) {
    $scope.items = [];
    $http({
        method: 'GET',
        url: apiUrl + '/issues'
    })
            .success(function(data) {
        $scope.items = data;
    })
            .error(function(data) {
        console.log("Error");
    });
})

        /*///////////////////////////////////GetIssueDetails///////////////////////////////////////////////*/

        .controller("GetIssueDetails", function($scope, $http, apiUrl, $stateParams, $ionicHistory) {
    $scope.issue = [];
    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };
    $http({
        method: 'GET',
        url: apiUrl + '/issues/' + $stateParams.issueId
    })
            .success(function(data) {
        $scope.issue = data;
        console.log(data);
    })
            .error(function(data) {
        console.log("Error");
    });

})




        /*///////////////////////////////////NewIssue///////////////////////////////////////////////*/

        .controller("NewIssue", function($scope, $http, apiUrl, $stateParams) {
    $scope.issue = [];
    $http({
        method: 'POST',
        url: apiUrl + '/issues/'
    })
            .success(function(data) {
        $scope.issue = data;
        console.log(data);
    })
            .error(function(data) {
        console.log("Error");
    });
})



