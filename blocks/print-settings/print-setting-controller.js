(function () {
    class PrintSettingsController {
        constructor(close, $state) {
            this.close = close;
            this.$state = $state;
            this.workingShift = "1";
        }

        $onDestroy() {
        }

        $onInit() {
        }

        print() {
            let st = moment(this.startPeriod);
            let end;
            if (this.workingShift === "1") {
                st = st.set({hour: 8, minute: 0, second: 0});
                end = st.clone().set({hour: 20, minute: 0, second: 0})
            } else {
                st = st.set({hour: 20, minute: 0, second: 0});
                end = st.clone().add('day', 1).set({hour: 8, minute: 0, second: 0});
            }
            this.close({
                startPeriod: st.format('MM-DD-YYYY HH:mm'),//.format('DD-MM-YYYY HH:mm'),
                endPeriod: end.format('MM-DD-YYYY HH:mm'),//format('DD-MM-YYYY HH:mm')
            });
            // this.$state.go('print', {
            //     startPeriod: st.format('DD-MM-YYYY HH:mm'),
            //     endPeriod: end.format('DD-MM-YYYY HH:mm')
            // });
            // console.log(st.format('DD-MM-YYYY HH:mm'), end.format('DD-MM-YYYY HH:mm'));
        }

    }

    PrintSettingsController.$inject = ['close', '$state'];

    angular.module('myApp').controller('printSettingsController', PrintSettingsController);
})();