angular.module('citizen-engagement.services', ['angular-storage'])

        .service('Issues', function($http, apiUrl) {
    return {
        getIssues: function() {
            return $http({
                method: 'GET',
                url: apiUrl + '/issues'
            })
        },
        postIssue: function(issueAdd, callback) {
            return $http({
                method: 'POST',
                url: apiUrl + '/issues',
                data: issueAdd
            }).
                    success(function(data, status, headers, config) {
                callback(null, data);
                console.log(data);
            }).
                    error(function(error) {
                callback(error);
                console.log("error");

            });
        },
        newComment: function(commentAdd, issueId, callback) {
            return $http({
                method: 'POST',
                url: apiUrl + '/issues' + issueId,
                data: commentAdd
            }).
                    success(function(data, status, headers, config) {
                callback(null, data);
                console.log(data);
            }).
                    error(function(error) {
                callback(error);
                console.log("error");

            });
        },
    };
})
