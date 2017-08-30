(function () {
    class TechnologicalLineService {
        constructor($http, $q, constant) {
            this.$http = $http;
            this.constant = constant;
        }

        get() {
            return this.$http.get(this.constant.apiServiceBaseUri + '/TechnologicalLine').then(response => response.data);
        }
    }

    TechnologicalLineService.$inject = ['$http', '$q', 'const'];
    angular.module('myApp').service('technologicalLineService', TechnologicalLineService);
})();