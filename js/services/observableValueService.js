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

        getPrint(params) {
            // 2017-09-15T08:00:00+05:00
            // 09-16-2017%2000:00
            let url = `${this.constant.apiServiceBaseUri}/ObservableValue/Print?parameters=${(params.parameters || '')}&startPeriod=${params.startPeriod}&endPeriod=${params.endPeriod}`;
            return this.$http.get(url).then(response => {
                return response.data;
            });
        }

    }

    ObservableValueService.$inject = ['$http', '$q', 'const'];
    angular.module('myApp').service('observableValueService', ObservableValueService);
})();