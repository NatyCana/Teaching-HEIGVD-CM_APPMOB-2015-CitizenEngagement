angular.module('citizen-engagement.services', ['angular-storage'])

        .service('Issues', function($http, apiUrl) {
    return {
        getIssues: function() {
            return $http({
                method: 'GET',
                url: apiUrl + '/issues'
            })
        },
        postIssue: function(issue, callback) {
            return $http({
                method: 'POST',
                url: apiUrl + '/issues',
                data: issue
            }).
                    success(function(data, status, headers, config) {
                callback(data);
                console.log(data);
            }).
                    error(function(data, status, headers, config) {
                console.log("error");

            });
        }
    };
})
