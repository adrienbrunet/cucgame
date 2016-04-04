angular.module('game')

    .config(['$resourceProvider', function ($resourceProvider) {
        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])

    .factory('Character', ['$resource', function ($resource) {
        return $resource('/api/characters/:pk/', {'pk': '@pk'}, {update: {'method': 'PUT'}, });
    }])

    .factory('Fight', ['$resource', function ($resource) {
        return $resource(
            '/api/fights/:pk/:action',
            {'pk': '@pk'},
            {
                update: {method: 'PUT'},
                getFightData: {method: 'GET', params: {action: 'get_fight_data'}}
            }
        );
    }]);
