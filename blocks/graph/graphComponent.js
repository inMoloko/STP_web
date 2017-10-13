(function () {
    class GraphController {
        constructor(observableValueService, $state, technologicalLineService, $linq, localStorageService, $timeout, authService, parameterService, notificationService, $q, ModalService, localSettingService) {
            this.dateFormat = 'MM-DD-YYYY HH:mm';
            this.$q = $q;
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
            this.startPeriod = this.$state.params.startPeriod ? moment(this.$state.params.startPeriod, this.dateFormat) : moment();
            this.endPeriod = this.$state.params.endPeriod ? moment(this.$state.params.endPeriod, this.dateFormat) : moment();
            this.ModalService = ModalService;
            this.localSettingService = localSettingService;
        }

        // setDiapasone(d_prm) {
        //     var cur = this.data[0].values[this.data[0].values.length - 1].x;
        //     var now = new Date(cur.getTime());
        //
        //     if (d_prm === 'day') {
        //         now.setDate(now.getDate() - 1);
        //     }
        //     if (d_prm === 'month') {
        //         now.setMonth(now.getMonth() - 1);
        //     }
        //     this.options.chart.brushExtent = [now, cur];
        // };

        // OpenReportPage(pageName) {
        //     var curD = this.options.chart.brushExtent;
        //     var left, right;
        //     if (curD == undefined) {
        //         left = $scope.data[0].values[0].x.getTime();
        //         right = $scope.data[0].values[$scope.data[0].values.length - 1].x.getTime();
        //     }
        //     else {
        //         left = curD[0].getTime();
        //         right = curD[1].getTime();
        //     }
        //     OpenReport(pageName, left, right);
        // };

        print() {
            this.ModalService.showModal({
                templateUrl: "blocks/print-settings/print-settings.html",
                controller: "printSettingsController",
                controllerAs: "$ctrl"
            }).then(result => result.close).then(result => {
                if (result !== false) {
                    // if (this.$state.params.parameters) {
                        this.$state.go('print', {
                            parameters: this.$state.params.parameters,
                            startPeriod: result.startPeriod,
                            endPeriod: result.endPeriod
                        });
                    // }
                }
            });
        }

        logOut() {
            this.authService.logOut();
            this.$state.go('login');
        }

        toggle() {
            this.listEnable = !this.listEnable;
            if (this.listEnable === false) {
                if (this.paramsList && this.paramsList.length !== 0) {
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


            this.chart.update();

        }

        changeParameterVisibility(value) {
            let self = this;
            if (value !== undefined && value.series !== undefined) {
                let parameter = value.series.Parameter.ParameterID;
                const result = self.observableValues.find(i => i.Parameter.ParameterID === parameter);
                result.disabled = !result.disabled;
                const tmp = self.currentValue.find(i => i.series.Parameter.ParameterID === parameter);
                tmp.series.disabled = result.disabled;
            }
            let disabled = self.currentValue.filter(i => i.series.disabled === true).map(i => i.series.Parameter.ParameterID);

            this.localSettingService.disabledParams = disabled;

            if (self.chart) {
                self.chart.update();
            }
        }

        period() {
            if (!this.startPeriod || !this.endPeriod) {
                return;
            }
            if (!moment.isMoment(this.startPeriod))
                this.startPeriod = moment(this.startPeriod);

            if (!moment.isMoment(this.endPeriod))
                this.endPeriod = moment(this.endPeriod);

            if (this.startPeriod.isSame(this.endPeriod, 'minute')) {
                this.notificationService.error('Начало и окончание периода равны');
                return;
            }
            if (this.startPeriod.isAfter(this.endPeriod, 'minute')) {
                this.notificationService.error('Начало периода не может быть больше окончания');
                return;
            }
            let self = this;
            this.$state.go('graph', {
                startPeriod: self.startPeriod.format(this.dateFormat),
                endPeriod: self.endPeriod.format(this.dateFormat),
                parameters: self.$state.params.parameters,
                interval: undefined
            });
        }

        $onInit() {
            let self = this;

            self.isBusy = true;

            self.canEditLimits = this.authService.userInRole('Engineer');

            let linesPromise = this.technologicalLineService.get();
            linesPromise.then(i => {
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
                        });
                }
            }, () => {
            });

            let valuesPromise = this.observableValueService.get(this.$state.params);
            valuesPromise.then(i => {
                const shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];
                self.observableValues = i;

                for (let k = 0; k < i.length; k++) {
                    i[k].values.forEach(value => {
                        value.shape = shapes[k];
                    });
                    // i[k].disabled =  true;
                }
                const disabled = self.localSettingService.disabledParams;
                if (disabled) {
                    disabled.forEach(j => {
                        let tmp = self.observableValues.find(k => k.Parameter.ParameterID == j);
                        if (tmp)
                            tmp.disabled = true;
                    });
                }

                self.currentValue = i.map(j => {
                    return {
                        series: {
                            key: j.key,
                            Parameter: j.Parameter,
                            disabled: j.disabled
                        },
                        // disabled :true
                    }
                });
                // self.currentValue[0].disabled = true;
                const xFormat = "%H:%M %d.%m.%y";// this.$state.params.interval > 24 ? "%H:%M %d.%m" : "%H:%M:%S";

                // Для того что бы убрать график снизу переопределил nv.models.focus, строка 95: return  false

                nv.addGraph(function () {
                    const chart = nv.models.lineWithFocusChart();
                    chart.useInteractiveGuideline(true);
                    chart.noData('Нет данных, измените параметры для отображения');
                    // chart.legendPosition('top');

                    chart.legend.maxKeyLength(150);
                    chart.legend.width(400);
                    // chart.focusEnable(false);
                    let days = [];
                    let label = chart.xAxis
                        .axisLabel('Дата/Время')
                        .tickFormat(function (d) {
                            let date = new Date(d);
                            if (!days.includes(date.getDate())) {
                                days.push(date.getDate());
                                return d3.time.format('%H:%M %d.%m.%y')(date);
                            } else {
                                return d3.time.format('%H:%M')(date);
                            }
                            return d3.time.format(xFormat)(date).split(' ');
                        });
                    chart.x2Axis
                        .tickFormat(function (d) {
                            return d3.time.format(xFormat)(new Date(d));
                        });

                    chart.yAxis
                        .tickFormat(d3.format('.2f'));
                    chart.showLegend(false);
                    chart.height(500);
                    chart.dispatch.on('stateChange', function (e) {
                        console.log(e, self.currentValue);
                    });

                    chart.xAxis.rotateLabels(-25);

                    chart.dispatch.on('renderEnd', function () {
                        // console.log('render complete');
                        self.$timeout(function () {
                            self.isBusy = false;

                            // let series = chart.interactiveLayer.tooltip.data().series;
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
                    chart.dispatch.on('mouseMove', function (newValue) {
                        self.$timeout(function () {
                            self.currentValue.forEach(v => {
                                v.point = null;
                                v.series.disabled = true;
                            });
                            newValue.forEach(v => {
                                const param = v.series.Parameter.ParameterID;
                                const result = self.currentValue.find(j => j.series.Parameter.ParameterID === param);
                                result.series.disabled = false;
                                result.point = v.point;
                            });
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

                    let color = nv.utils.defaultColor();
                    let tmp = [];
                    d3.selectAll('g[class^="nv-group nv-series-"]:not(.nv-noninteractive)').each(function (d, i) {
                        let t = color(d, i);
                        tmp.push(t);
                    });
                    // tmp = tmp.slice(0, 10);
                    for (let index = 0; index < self.currentValue.length; index++) {
                        self.currentValue[index].series.color = tmp[index];
                    }
                    let t = d3.selectAll('.nv-axis g.tick');
                    nv.utils.windowResize(function () {
                        chart.update();
                        // d3.select('.nv-legendWrap').attr('transform', 'translate(0,400)');
                    });
                    self.chart = chart;
                    return chart;

                });
            }, () => {

            });

            this.$q.all([linesPromise, valuesPromise]).then(() => {
                // если параметров нет то мы берем те которые
                // пришли с сервера
                if (!this.$state.params.parameters && this.currentValue) {
                    let ids = this.currentValue.map(i => i.series.Parameter.ParameterID);
                    this.$linq
                        .Enumerable()
                        .From(this.paramsList)
                        .SelectMany(i => i.Sectors)
                        .SelectMany(i => i.Nodes)
                        .SelectMany(i => i.Parametrs)
                        .ForEach(i => {
                            if (ids.includes(i.ParameterID)) {
                                i.isChecked = true;
                            }
                        });
                }
            }, () => {
                this.notificationService.error();
            });
        }

    }

    GraphController
        .$inject = ['observableValueService', '$state', 'technologicalLineService', '$linq', 'localStorageService', '$timeout', 'authService', 'parameterService', 'notificationService', '$q', 'ModalService', 'localSettingService'];

    const
        component = {controller: GraphController, templateUrl: 'blocks/graph/graph.html'};

    angular
        .module(
            'myApp'
        ).component('graphComponent', component);
})();