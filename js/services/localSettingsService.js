(function () {
    class LocalSettingsService {
        constructor(authService, localStorageService) {
            this.authService = authService;
            this.localStorageService = localStorageService;
        }

        set disabledParams(parameters) {
            const userName = this.authService.userName;
            let object = this.localStorageService.get('graphParams');
            if (!object) {
                object = {};
            }
            if (!object[userName]) {
                object[userName] = {};
            }
            object[userName].disabled = parameters;
            this.localStorageService.set('graphParams', object);
        }

        get disabledParams() {
            const userName = this.authService.userName;
            let object = this.localStorageService.get('graphParams');
            if (!object || !object[userName]) {
                return null;
            }
            return object[userName].disabled;
        }

    }

    LocalSettingsService.$inject = ['authService', 'localStorageService'];
    angular.module('myApp').service('localSettingService', LocalSettingsService);
})();