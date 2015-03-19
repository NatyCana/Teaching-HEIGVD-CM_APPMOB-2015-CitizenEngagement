angular.module('citizen-engagement.services', ['angular-storage'])

        .service('Issues', function($http, apiUrl) {
    return {
        getIssues: function() {
            return $http({
                method: 'GET',
                url: apiUrl + '/issues'
            })
        }
    };
})