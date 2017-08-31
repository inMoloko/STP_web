(function () {
    class GraphController {
        constructor(observableValueService, $state, technologicalLineService, $linq, localStorageService, $timeout, authService, parameterService, notificationService) {
            this.observableValueService = observableValueService;
            this.$timeout = $timeout;
            this.localStorageService = localStorageService;
            this.$state = $state;
            this.technologicalLineService = technologicalLineService;
            this.$linq = $linq;
            this.authService = authService;
            this.parameterService = parameterService;
            this.notificationService = notificationService;
            this.listEnable = false;
            this.isBusy = false;
        }

        setDiapasone(d_prm) {
            var cur = this.data[0].values[this.data[0].values.length - 1].x;
            var now = new Date(cur.getTime());

            if (d_prm === 'day') {
                now.setDate(now.getDate() - 1);
            }
            if (d_prm === 'month') {
                now.setMonth(now.getMonth() - 1);
            }
            this.options.chart.brushExtent = [now, cur];
        };

        OpenReportPage(pageName) {
            var curD = this.options.chart.brushExtent;
            var left, right;
            if (curD == undefined) {
                left = $scope.data[0].values[0].x.getTime();
                right = $scope.data[0].values[$scope.data[0].values.length - 1].x.getTime();
            }
            else {
                left = curD[0].getTime();
                right = curD[1].getTime();
            }
            OpenReport(pageName, left, right);
        };

        print() {
            if (this.$state.params.interval <= 24) {
                this.$state.go('print');
            }
        }

        toggle() {
            this.listEnable = !this.listEnable;
            if (this.listEnable === false) {
                if (this.paramsList && this.paramsList.length !== 0) {
                    // const params = [];
                    // this.paramsList.forEach(line => {
                    //     line.sectors.forEach(sector => {
                    //         sector.Nodes.forEach(node => {
                    //             node.forEach(node => {
                    //                 if(node.)
                    //             })
                    //         })
                    //     })
                    // });
                    const parameters = this.$linq
                        .Enumerable()
                        .From(this.paramsList)
                        .SelectMany(i => i.Sectors)
                        .SelectMany(i => i.Nodes)
                        .SelectMany(i => i.Parametrs)
                        .Where(i => i.isChecked === true)
                        .Select(i => i.ParameterID)
                        .ToArray().join(',');

                    if (this.$state.params.parameters !== parameters) {
                        this.$state.params.parameters = parameters;
                        this.$state.go('graph', {parameters: this.$state.params.parameters});
                    }
                }
            }
        }

        resetAll(obj) {
            let query;
            if (obj.Sectors) {
                query = this.$linq.Enumerable()
                    .From(obj.Sectors)
                    .SelectMany(i => i.Nodes)
                    .SelectMany(i => i.Parametrs)
            }
            if (obj.Nodes) {
                query = this.$linq.Enumerable()
                    .From(obj.Nodes)
                    .SelectMany(i => i.Parametrs)
            }
            if (obj.Parametrs) {
                query = this.$linq.Enumerable()
                    .From(obj.Parametrs)
            }
            query.ForEach(i => {
                i.isChecked = false;
            });
        }

        checkAll(obj) {
            let query;
            if (obj.Sectors) {
                query = this.$linq.Enumerable()
                    .From(obj.Sectors)
                    .SelectMany(i => i.Nodes)
                    .SelectMany(i => i.Parametrs)
            }
            if (obj.Nodes) {
                query = this.$linq.Enumerable()
                    .From(obj.Nodes)
                    .SelectMany(i => i.Parametrs)
            }
            if (obj.Parametrs) {
                query = this.$linq.Enumerable()
                    .From(obj.Parametrs)
            }
            query.ForEach(i => {
                i.isChecked = true;
            });
        }

        lineChecked(line) {
            let query;
            if (line.Sectors) {
                query = this.$linq.Enumerable()
                    .From(line.Sectors)
                    .SelectMany(i => i.Nodes)
                    .SelectMany(i => i.Parametrs);
            }
            if (line.Nodes) {
                query = this.$linq.Enumerable()
                    .From(line.Nodes)
                    .SelectMany(i => i.Parametrs)
            }
            if (line.Parametrs) {
                query = this.$linq.Enumerable()
                    .From(line.Parametrs)
            }
            let obj = {
                total: query.Count(), checked: query.Count(i => i.isChecked === true)
            };
            obj.text = `${line.Name} (${obj.checked})`;
            obj.isChecked = obj.total === obj.checked;
            obj.isEmpty = obj.checked !== 0;
            obj.canReset = obj.total !== obj.checked && obj.checked !== 0;
            return obj;
        }

        $onDestroy() {
            d3.select('svg').remove();
        }

        editMode(series, paramName) {
            if (series && this.canEditLimits) {
                series[paramName] = true;
            }
        }

        save(series) {
            this.parameterService.update(series.Parameter).then(() => {
                this.notificationService.success('Параметры обновлены');
                series.downErrPlcEnable = false;
                series.upErrPlcEnable = false;
            });

        }

        getDate() {
            if (!this.currentValue)
                return;
            let data = this.currentValue.find(i => i.point && i.point.x);
            if (!data)
                return;
            return d3.time.format("%H:%M %d.%m")(data.point.x);
        }

        set() {
            //this.currentValue.splice(0,1);
            //this.currentValue[0].series.disable = true;
            //this.chart.state.disabled = [true, false, true];
            this.chart.state.disabled = [true, true, false];
            this.chart.update();

        }

        $onInit() {
            let self = this;
            self.isBusy = true;

            self.canEditLimits = this.authService.userInRole('Engineer');

            this.technologicalLineService.get().then(i => {
                this.paramsList = i;
                const params = this.$state.params.parameters ? this.$state.params.parameters.split(',').map(i => +i) : [];
                if (this.$state.params.parameters) {
                    this.$linq
                        .Enumerable()
                        .From(this.paramsList)
                        .SelectMany(i => i.Sectors)
                        .SelectMany(i => i.Nodes)
                        .SelectMany(i => i.Parametrs)
                        .ForEach(i => {
                            if (params.includes(i.ParameterID)) {
                                i.isChecked = true;
                            }
                        })
                    ;
                }
            });

            this.observableValueService.get(this.$state.params).then(i => {
                const shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];

                for (let k = 0; k < i.length; k++) {
                    i[k].values.forEach(value => {
                        value.shape = shapes[k];
                    });
                }

                self.currentValue = i.map(j => {
                    return {
                        series: {
                            key: j.key,
                            Parameter: j.Parameter,
                        },
                        // disabled :true
                    }
                });
                // self.currentValue[0].disabled = true;

                const xFormat = this.$state.params.interval > 24 ? "%H:%M %d.%m" : "%H:%M:%S";

                nv.addGraph(function () {
                    const chart = nv.models.lineWithFocusChart();
                    chart.useInteractiveGuideline(true);

                    // chart.legendPosition('top');

                    chart.legend.maxKeyLength(150);
                    chart.legend.width(400);
                    chart.xAxis
                        .axisLabel('Время')
                        .tickFormat(function (d) {
                            return d3.time.format(xFormat)(new Date(d));
                        });
                    chart.x2Axis
                        .tickFormat(function (d) {
                            return d3.time.format(xFormat)(new Date(d));
                        });
                    chart.yAxis
                        .tickFormat(d3.format(',.2f'));
                    chart.showLegend(true);
                    chart.height(500);

                    chart.dispatch.on('stateChange', function (e) {
                        console.log(e, self.currentValue);
                    });

                    chart.dispatch.on('renderEnd', function () {
                        // console.log('render complete');
                        self.$timeout(function () {
                            self.isBusy = false;
                        });
                    });
                    chart.lines.dispatch.on('elementClick', function (e) {
                        self.$timeout(function () {
                            self.currentValue = e;
                        });
                    });
                    chart.dispatch.on('elementMouseout', function (e) {
                        self.$timeout(function () {
                            if (self.currentValue) {
                                self.currentValue.forEach(value => {
                                    value.point = null;
                                });
                            }

                        });
                    });
                    chart.dispatch.on('mouseMove', function (e) {
                        self.$timeout(function () {
                            self.currentValue = e;
                        });
                    });
                    // chart.dispatch.on('stateChange', function(e) {
                    //     setTimeout(function () {
                    //         d3.select('.nv-legendWrap').attr('transform', 'translate(0,400)');
                    //     });
                    // });
                    d3.select('svg')
                        .datum(i)
                        .transition().duration(500)
                        .call(chart);
                    // chart.state.disabled = [true, true, true, true];
                    // chart.state.disengaged = [false, false, false, false];
                    // chart.legend.dispatch.stateChange(chart.state);
                    // chart.update();

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
                        // d3.select('.nv-legendWrap').attr('transform', 'translate(0,400)');
                    });
                    self.chart = chart;
                    return chart;

                });
            });
        }

    }

    GraphController
        .$inject = ['observableValueService', '$state', 'technologicalLineService', '$linq', 'localStorageService', '$timeout', 'authService', 'parameterService', 'notificationService'];

    const
        component = {controller: GraphController, templateUrl: 'blocks/graph/graph.html'};

    angular.module('myApp').component('graphComponent', component);
})();