(function () {
    angular.module('myApp').factory('authInterceptorService', ['$injector', '$q', function ($injector, $q) {


        return {
            request: function (config) {

                config.headers = config.headers || {};
                const authService = $injector.get('authService');

                if (authService.authorized()) {
                    config.headers.Authorization = 'Bearer ' + authService.token;
                }

                return config;
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    const authService = $injector.get('authService');
                    const $state = $injector.get('$state');
                    authService.logOut();
                    $state.go('login');
                }
                return $q.reject(rejection);
            }
        };
    }]);
})();