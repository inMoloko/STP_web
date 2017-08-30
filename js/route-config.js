angular.module('myApp').config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider.state({
        name: 'login',
        url: '/login',
        component: 'loginComponent'
    });
    $stateProvider.state({
        name: 'graph',
        url: '/graph?interval&parameters',
        component: 'graphComponent'
    });
    $stateProvider.state({
        name: 'upload',
        url: '/upload',
        component: 'uploadComponent'
    });
    $stateProvider.state({
        name: 'print',
        url: '/print',
        component: 'printComponent'
    });
}]);