(function () {
    class UploadController {
        constructor(FileUploader, constants, notificationService, uploadService, authService, $state) {
            this.uploadService = uploadService;
            this.$state = $state;
            this.authService = authService;
            this.constants = constants;
            this.uploader = new FileUploader({
                url: constants.apiServiceBaseUri + 'Config',
                queueLimit: 1,
            });
            this.uploader.onAfterAddingFile = function (fileItem) {
                console.info('onAfterAddingFile', fileItem);
            };
            this.uploader.onAfterAddingAll = function (addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            this.uploader.filters.push({
                name: 'xlsx',
                fn: function (item) {
                    return /xlsx/.test(item.name);
                }
            });
            this.uploader.onSuccessItem = (fileItem, response, status, headers) => {
                notificationService.success('Файл успешно загружен');
                this.uploader.clearQueue();
            };
            this.uploader.onErrorItem = (fileItem, response, status, headers) => {
                notificationService.error('Произошла ошибка: ' + response.description);
                this.uploader.clearQueue();
            }
        }

        $onDestroy() {
        }

        logOut() {
            this.authService.logOut();
            this.$state.go('login');
        }

        $onInit() {
            this.uploadService.get().then(i => {
                this.link = this.constants.apiServiceBaseUri + i;
            });
        }

    }

    UploadController.$inject = ['FileUploader', 'const', 'notificationService', 'uploadService', 'authService', '$state'];

    const component = {controller: UploadController, templateUrl: 'blocks/upload/upload.html'};

    angular.module('myApp').component('uploadComponent', component);
})();