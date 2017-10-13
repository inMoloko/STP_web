/**
 * Created by Terminal on 23.08.2017.
 */
angular.module('myApp', ['nvd3', 'ui.router', 'LocalStorageModule', 'angular-linq', 'angularFileUpload', 'datePicker', 'angularModalService'])
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
                if (!authService.userInRole('Operator') && !authService.userInRole('Engineer')) {
                    return $state.go('login');
                }
            });
            $transitions.onStart({
                to: function (state) {
                    return state.name === 'upload';
                },
            }, function () {
                if (!authService.userInRole('Administrator')) {
                    return $state.go('login');
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
                let def = localStorageService.get('graphParams') || {};
                const userName = authService.userName;
                def = userName != null ? def[userName] : {};
                def = def || {};
                if (!def.startPeriod && !def.startPeriod && !def.interval)
                    def.interval = 1;
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
                const userName = authService.userName;
                let object = localStorageService.get('graphParams') || {};
                object[userName] = data.params();
                localStorageService.set('graphParams', object);
            });
        }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    }]);
