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
            // this.observableValueService.get(this.$state.params).then(i => {
            //     const shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];
            //
            //     for (let k = 0; k < i.length; k++) {
            //         i[k].values.forEach(value => {
            //             value.shape = shapes[k];
            //         });
            //     }
            //
            //     nv.addGraph(function () {
            //         const chart = nv.models.lineWithFocusChart();
            //         chart.useInteractiveGuideline(true);
            //         chart.legendPosition('top');
            //         chart.xAxis
            //             .axisLabel('Время')
            //             .tickFormat(function (d) {
            //                 return d3.time.format("%H:%M:%S")(new Date(d));
            //             });
            //         chart.x2Axis
            //             .tickFormat(function (d) {
            //                 return d3.time.format("%H:%M:%S")(new Date(d));
            //             });
            //         chart.yAxis
            //             .tickFormat(d3.format(',.2f'));
            //         // chart.showLegend(false);
            //         chart.height(400);
            //         // chart.legend.margin({bottom: 20, top: 160, right: 0, left: 0});
            //
            //         d3.select('svg')
            //             .datum(i)
            //             .transition().duration(500)
            //             .call(chart);
            //
            //         d3.select('.nv-legendWrap').attr('transform', 'translate(0,400)');
            //         //chart.legend.attr('transform', 'translate(0,400)');
            //
            //         d3.selectAll('.nv-series').each(function (d, i) {
            //             const group = d3.select(this),
            //                 circle = group.select('circle');
            //             const color = circle.style('fill');
            //             circle.remove();
            //             const symbol = group.append('path')
            //                 .attr('d', d3.svg.symbol().type(shapes[i + 1]))
            //                 .style('stroke', color)
            //                 .style('fill', color)
            //                 // ADJUST SIZE AND POSITION
            //                 .attr('transform', 'scale(1.5) translate(-2,0)')
            //         });
            //
            //         nv.utils.windowResize(function () {
            //             chart.update();
            //             d3.select('.nv-legendWrap').attr('transform', 'translate(0,400)');
            //         });
            //
            //         return chart;
            //
            //     });
            // });
            this.observableValueService.get_Print(this.$state.params).then(i => {
                var table = document.getElementById("myTable");

                var h =document.getElementById("HEADER");

                var reportDate = new Date(Date.now());
                var tmp =reportDate.getHours();
                if (tmp < 20)
                    reportDate.setDate(reportDate.getDate() - 1);

//TODO КАК ТУТ СДЕЛАТЬ СТРИНГ ФОРМАТ ХОСПАДИИСУСЕ!!
                h.textContent = 'Отчет за ' + reportDate + ' с 8:00 до 20:00';


                for (let k = i.length -1; k >= 0; k--) {
                    var row = table.insertRow(1);

                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);

                    var time = new Date(i[k].id);

                    cell1.innerHTML = time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
                    cell2.innerHTML = i[k].name;
                    cell3.innerHTML = i[k].value;
                    cell4.innerHTML = i[k].norma;


                    var img = document.createElement('img');
                    img.height = 20;
                    img.width = 20;
                    img.align="right";

                    if (i[k].normType == 1) {
                        img.src = "blocks/print/hot.png";
                        cell3.appendChild(img)
                    }
                    else
                    {
                        img.src = "blocks/print/cold.png";
                        cell3.appendChild(img)
                    }

                    cell5.innerHTML = "";
                    cell5.width = 350;
                }


            });
        }

    }

    PrintController.$inject = ['observableValueService', '$state'];

    const component = {controller: PrintController, templateUrl: 'blocks/print/print.html'};


    angular.module('myApp').component('printComponent', component);
})();