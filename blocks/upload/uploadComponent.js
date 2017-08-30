(function () {
    class UploadController {
        constructor(FileUploader, constants) {
            this.uploader = new FileUploader({
                url: constants.apiServiceBaseUri + 'Config',
                queueLimit: 1,
            });
            this.uploader.onAfterAddingFile = function(fileItem) {
                console.info('onAfterAddingFile', fileItem);
            };
            this.uploader.onAfterAddingAll = function(addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            this.uploader.filters.push({
                name: 'xlsx',
                fn: function(item) {
                    return /xlsx/.test(item.name);
                }
            });
        }

        $onDestroy() {
        }

        $onInit() {

        }

    }

    UploadController.$inject = ['FileUploader','const'];

    const component = {controller: UploadController, templateUrl: 'blocks/upload/upload.html'};

    angular.module('myApp').component('uploadComponent', component);
})();