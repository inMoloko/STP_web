(function () {
    class PrintController {
        constructor(observableValueService, $state) {
            this.observableValueService = observableValueService;
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
            this.reportDate = reportDate;

            this.observableValueService.get_Print(this.$state.params).then(i => {
                this.data = i;
                return;
//                 var table = document.getElementById("myTable");
//
//                 var h = document.getElementById("HEADER");
//
//                 var reportDate = new Date(Date.now());
//                 var tmp = reportDate.getHours();
//                 if (tmp < 20)
//                     reportDate.setDate(reportDate.getDate() - 1);
//                 this.reportDate = reportDate;
//
// //TODO КАК ТУТ СДЕЛАТЬ СТРИНГ ФОРМАТ ХОСПАДИИСУСЕ!!
//                 h.textContent = 'Отчет за ' + reportDate + ' с 8:00 до 20:00';
//
//
//                 for (let k = i.length - 1; k >= 0; k--) {
//                     var row = table.insertRow(1);
//
//                     var cell1 = row.insertCell(0);
//                     var cell2 = row.insertCell(1);
//                     var cell3 = row.insertCell(2);
//                     var cell4 = row.insertCell(3);
//                     var cell5 = row.insertCell(4);
//
//                     var time = new Date(i[k].id);
//
//                     cell1.innerHTML = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
//                     cell2.innerHTML = i[k].name;
//                     cell3.innerHTML = i[k].value;
//                     cell4.innerHTML = i[k].norma;
//
//
//                     var img = document.createElement('img');
//                     img.height = 20;
//                     img.width = 20;
//                     img.align = "right";
//
//                     if (i[k].normType == 1) {
//                         img.src = "blocks/print/hot.png";
//                         cell3.appendChild(img)
//                     }
//                     else {
//                         img.src = "blocks/print/cold.png";
//                         cell3.appendChild(img)
//                     }
//
//                     cell5.innerHTML = "";
//                     cell5.width = 350;
//                 }


            });
        }

    }

    PrintController.$inject = ['observableValueService', '$state'];

    const component = {controller: PrintController, templateUrl: 'blocks/print/print.html'};


    angular.module('myApp').component('printComponent', component);
})();