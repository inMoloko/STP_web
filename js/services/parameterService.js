(function () {
    class ParameterService {
        constructor($http, $q, constant) {
            this.$http = $http;
            this.constant = constant;
        }
        update(parameter) {
            return this.$http.put(this.constant.apiServiceBaseUri + 'Parameter/'+ parameter.ParameterID, parameter);
        }
    }

    ParameterService.$inject = ['$http', '$q', 'const'];
    angular.module('myApp').service('parameterService', ParameterService);
})();