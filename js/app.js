/**
 * Created by Terminal on 23.08.2017.
 */
angular.module('myApp', ['nvd3', 'ui.router', 'LocalStorageModule', 'angular-linq', 'angularFileUpload'])
    .run(['$transitions', 'authService', '$state', 'localStorageService',
        function ($transitions, authService, $state, localStorageService) {
            $transitions.onStart({
                to: function (state) {
                    return state.name != 'login';
                }
            }, function () {
                if (!authService.authorized()) {
                    return $state.go("login");
                }
            });
            $transitions.onStart({
                to: function (state) {
                    return state.name === 'graph';
                },
            }, function () {
                if(!authService.userInRole('Operator')){
                    return $state.go('upload');
                }
            });
            $transitions.onStart({
                to: function (state) {
                    return state.name === 'upload';
                },
            }, function () {
                if(!authService.userInRole('Administrator')){
                    const def = localStorageService.get('graphParams');
                    return $state.go('graph', def);
                }
            });
            $transitions.onStart({
                to: function (state) {
                    return state.name === 'graph';
                },
                from: function (state) {
                    return state.name !== 'graph';
                }
            }, function () {
                const def = localStorageService.get('graphParams');
                return $state.go("graph", def);
            });
            $transitions.onStart({
                to: function (state) {
                    return state.name === 'graph';
                },
                from: function (state) {
                    return state.name === 'graph';
                }
            }, function (data) {
                localStorageService.set('graphParams', data.params());
            });
        }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    }]);
