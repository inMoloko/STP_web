(function () {
    class LoginController {
        constructor(authService, $state) {
            this.authService = authService;
            this.error = null;
            this.$state = $state;
        }

        $onInit() {

        }

        login() {
            this.authService.login(this).then(() => {
                this.error = null;
                this.$state.go('graph');
            }, error => {
                this.error = error;
            });
        }
    }

    LoginController.$inject = ['authService', '$state'];

    const component = {controller: LoginController, templateUrl: 'blocks/login/login.html'};


    angular.module('myApp').component('loginComponent', component);
})();
