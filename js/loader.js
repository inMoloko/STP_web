angular.module("myApp").directive("loader", [
    '$rootScope', '$timeout', function ($rootScope, $timeout) {
        return function ($scope, element, attrs) {
            element[0].style.display = 'none';
            $scope.$on("loader_show", function () {
                element[0].style.display = 'block';
            });
            return $scope.$on("loader_hide", function () {
                element[0].style.display = 'none';
            });
        };
    }
]);