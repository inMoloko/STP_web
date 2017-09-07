(function () {
    class ObservableValueService {
        constructor($http, $q, constant) {
            this.$http = $http;
            this.constant = constant;
        }

        get(params) {

            let url;
            if (params.endPeriod && params.startPeriod) {
                url = `${this.constant.apiServiceBaseUri}/ObservableValue?endPeriod=${params.endPeriod}&startPeriod=${params.startPeriod}&parameters=` + (params.parameters || '');
            }
            else {
                url = `${this.constant.apiServiceBaseUri}/ObservableValue?interval=${params.interval || 24}&parameters=` + (params.parameters || '');
            }



            return this.$http.get(url).then(response => {

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

        get_Print(params) {
            return this.$http.get(`${this.constant.apiServiceBaseUri}/ObservableValue/Print?parameters=` + (params.parameters || '')).then(response => {
                return response.data;
            });
        }

    }

    ObservableValueService.$inject = ['$http', '$q', 'const'];
    angular.module('myApp').service('observableValueService', ObservableValueService);
})();