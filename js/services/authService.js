(function () {
    class AuthService {
        constructor($http, $q, ngAuthSettings, localStorageService) {
            this.$http = $http;
            this.$q = $q;
            this.ngAuthSettings = ngAuthSettings;
            this.localStorageService = localStorageService;
        }

        authorized() {
            return !!this.localStorageService.get('authorizationData');
        }

        userInRole(role) {
            let data = this.localStorageService.get('authorizationData');
            if (!data)
                return false;
            return data.roles.includes(role);
        }
        get userName() {
            let data = this.localStorageService.get('authorizationData');
            if (!data)
                return null;
            return data.userName;
        }
        get token() {
            return this.localStorageService.get('authorizationData').token;
        }

        login(loginData) {
            let data = `grant_type=password&username=${loginData.userName}&password=${loginData.password}`;

            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + this.ngAuthSettings.clientId;
            }

            const deferred = this.$q.defer();

            this.$http.post(this.ngAuthSettings.apiServiceBaseUri + 'token', data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {

                response = response.data;
                // this.token = response.access_token;
                // this.expires = response['.expires'];

                this.localStorageService.set('authorizationData', {
                    token: response.access_token,
                    expires: response['.expires'],
                    roles: response.roles,
                    userName: response.userName
                });

                deferred.resolve(response.userName);

            }, (err, status) => {
                this.logOut();
                deferred.reject(err.data.error_description);
            });
            return deferred.promise;
        }

        logOut() {
            this.localStorageService.remove('authorizationData');
            // this.token = null;
            // this.expires = null;
        }
    }

    AuthService.$inject = ['$http', '$q', 'const', 'localStorageService'];
    angular.module('myApp').service('authService', AuthService);
})();