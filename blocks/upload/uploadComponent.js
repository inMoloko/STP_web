(function () {
    class UploadController {
        constructor(FileUploader, constants, notificationService, uploadService) {
            this.uploadService = uploadService;
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
            this.uploader.onCompleteAll = () => {
                notificationService.success('Файл успешно загружен');
                this.uploader.clearQueue();
            }
        }

        $onDestroy() {
        }

        $onInit() {
            this.uploadService.get().then(i => {
                this.link = this.constants.apiServiceBaseUri + i;
            });
        }

    }

    UploadController.$inject = ['FileUploader', 'const', 'notificationService', 'uploadService'];

    const component = {controller: UploadController, templateUrl: 'blocks/upload/upload.html'};

    angular.module('myApp').component('uploadComponent', component);
})();