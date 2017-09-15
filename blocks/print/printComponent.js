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
            let st = moment(this.$state.params.startPeriod);
            let end = moment(this.$state.params.endPeriod);
            this.reportDate = `Отчет c ${st.format('DD.MM.YYYY HH:mm')} по ${end.format('DD.MM.YYYY HH:mm')}`;

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