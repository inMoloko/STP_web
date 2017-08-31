(function () {
    class UploadService {
        constructor($http, $q, constant) {
            this.$http = $http;
            this.constant = constant;
        }

        get() {
            return this.$http.get(this.constant.apiServiceBaseUri + '/Config').then(response => response.data);
        }
    }

    UploadService.$inject = ['$http', '$q', 'const'];
    angular.module('myApp').service('uploadService', UploadService);
})();