angular.module('game')

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
