(function () {
    class PrintController {
        constructor(observableValueService, $state, notificationService) {
            this.observableValueService = observableValueService;
            this.notificationService = notificationService;
            this.$state = $state;
        }

        $onDestroy() {
            d3.select('svg').remove();
        }

        $onInit() {
            let reportDate = new Date();
            let tmp = reportDate.getHours();
            if (tmp < 20)
                reportDate.setDate(reportDate.getDate() - 1);
            let st = moment(this.$state.params.startPeriod,'MM-DD-yyyy HH:mm');
            let end = moment(this.$state.params.endPeriod,'MM-DD-yyyy HH:mm');
            this.reportDate = `За период c ${st.format('HH:mm')} по ${end.format('HH:mm')}  ${end.format('DD.MM.YYYY')}г.`;

            this.isBusy = true;
            this.observableValueService.getPrint(this.$state.params).then(i => {
                this.data = i;
                this.isBusy = false;
                return;
            }, i => {
                this.notificationService.error();
            });
        }

    }

    PrintController.$inject = ['observableValueService', '$state', 'notificationService'];

    const component = {controller: PrintController, templateUrl: 'blocks/print/print.html'};


    angular.module('myApp').component('printComponent', component);
})();