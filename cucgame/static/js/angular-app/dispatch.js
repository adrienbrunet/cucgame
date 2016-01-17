angular.module('dispatch', [
    'ng', 'ngRoute', 'game', 'ngCookies', 'ngAnimate', 'ui.bootstrap',
])

/*
 Define all the routes
 */
.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'home.html',
                controller: 'MainController as ctrl',
            })
            .otherwise( {
                // CAUTION: redirectTo doesn't fire $routeChangeStart, and so isn't affected by our catch-all redirection
                redirectTo: '/'
            });

    }]
)
