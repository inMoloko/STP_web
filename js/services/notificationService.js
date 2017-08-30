(function () {
    class NotificationService {
        constructor() {
        }
        success(message) {
            const x = document.getElementById("snackbar");
            x.innerText = message;
            x.classList.toggle('show');
            setTimeout(function(){ x.classList.toggle('show'); }, 3000);
        }
    }

    NotificationService.$inject = ['$http', '$q', 'const'];
    angular.module('myApp').service('notificationService', NotificationService);
})();