(function () {
    class ObservableValueService {
        constructor($http, $q, constant) {
            this.$http = $http;
            this.constant = constant;
        }

        get(params) {
            return this.$http.get(`${this.constant.apiServiceBaseUri}/ObservableValue?interval=${params.interval || 24}&parameters=` + (params.parameters || '')).then(response => {

                response.data.forEach(ov => {
                    ov.values = ov.values.map(j => {
                        return {
                            x: new Date(j.x),
                            y: j.y
                        }
                    });
                });
                return response.data;
            });
        }

    }

    ObservableValueService.$inject = ['$http', '$q', 'const'];
    angular.module('myApp').service('observableValueService', ObservableValueService);
})();