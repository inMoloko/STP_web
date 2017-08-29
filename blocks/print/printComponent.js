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
            this.observableValueService.get(this.$state.params).then(i => {
                const shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];

                for (let k = 0; k < i.length; k++) {
                    i[k].values.forEach(value => {
                        value.shape = shapes[k];
                    });
                }

                nv.addGraph(function () {
                    const chart = nv.models.lineWithFocusChart();
                    chart.useInteractiveGuideline(true);
                    chart.legendPosition('top');
                    chart.xAxis
                        .axisLabel('Время')
                        .tickFormat(function (d) {
                            return d3.time.format("%H:%M:%S")(new Date(d));
                        });
                    chart.x2Axis
                        .tickFormat(function (d) {
                            return d3.time.format("%H:%M:%S")(new Date(d));
                        });
                    chart.yAxis
                        .tickFormat(d3.format(',.2f'));
                    // chart.showLegend(false);
                    chart.height(400);
                    // chart.legend.margin({bottom: 20, top: 160, right: 0, left: 0});

                    d3.select('svg')
                        .datum(i)
                        .transition().duration(500)
                        .call(chart);

                    d3.select('.nv-legendWrap').attr('transform', 'translate(0,400)');
                    //chart.legend.attr('transform', 'translate(0,400)');

                    d3.selectAll('.nv-series').each(function (d, i) {
                        const group = d3.select(this),
                            circle = group.select('circle');
                        const color = circle.style('fill');
                        circle.remove();
                        const symbol = group.append('path')
                            .attr('d', d3.svg.symbol().type(shapes[i + 1]))
                            .style('stroke', color)
                            .style('fill', color)
                            // ADJUST SIZE AND POSITION
                            .attr('transform', 'scale(1.5) translate(-2,0)')
                    });

                    nv.utils.windowResize(function () {
                        chart.update();
                        d3.select('.nv-legendWrap').attr('transform', 'translate(0,400)');
                    });

                    return chart;

                });
            });
        }

    }

    PrintController.$inject = ['observableValueService', '$state'];

    const component = {controller: PrintController, templateUrl: 'blocks/print/print.html'};


    angular.module('myApp').component('printComponent', component);
})();