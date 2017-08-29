// (function () {
//     class GraphController {
//         constructor(observableValueService) {
//             this.observableValueService = observableValueService;
//         }
//
//         setDiapasone(d_prm) {
//             var cur = this.data[0].values[this.data[0].values.length - 1].x;
//             var now = new Date(cur.getTime());
//
//             if (d_prm === 'day') {
//                 now.setDate(now.getDate() - 1);
//             }
//             if (d_prm === 'month') {
//                 now.setMonth(now.getMonth() - 1);
//             }
//             this.options.chart.brushExtent = [now, cur];
//         };
//
//         OpenReportPage(pageName) {
//             var curD = this.options.chart.brushExtent;
//             var left, right;
//             if (curD == undefined) {
//                 left = $scope.data[0].values[0].x.getTime();
//                 right = $scope.data[0].values[$scope.data[0].values.length - 1].x.getTime();
//             }
//             else {
//                 left = curD[0].getTime();
//                 right = curD[1].getTime();
//             }
//             OpenReport(pageName, left, right);
//         };
//
//         $onInit() {
//             this.options = {
//                 chart: {
//                     type: 'lineWithFocusChart',
//                     height: 650,
//                     margin: {
//                         top: 5,
//                         right: 30,
//                         bottom: 50,
//                         left: 60
//                     },
//                     x: function (d) {
//                         return d.x;
//                     },
//                     y: function (d) {
//                         return d.y;
//                     },
//                     // focusMargin: {
//                     //     top: 0,
//                     //     bottom: 0
//                     // },
//                     useInteractiveGuideline: true,
//                     legend: {
//                         maxKeyLength: 40,
//                         padding: 45,
//                         rightAlign: true,
//                         margin: {
//                             top: 22,
//                             bottom: 22
//                         }
//                     },
//                     legendPosition: 'top',
//                     scatter: {
//                         onlyCircles: false
//                     },
//                     showDistX: true,
//                     showDistY: true,
//                     pointRange: [100, 5000],
//                     dispatch: {
//                         stateChange: function (e) {
//                             console.log("stateChange");
//                         },
//                         changeState: function (e) {
//                             console.log("changeState");
//                         },
//                         tooltipShow: function (e) {
//                             console.log("tooltipShow");
//                         },
//                         tooltipHide: function (e) {
//                             console.log("tooltipHide");
//                         }
//                     },
//                     showValues: true,
//                     xAxis: {
//                         axisLabel: 'Date',
//                         rotateLabels: -7,
//                         tickFormat: function (d) {
//                             return d3.time.format("%H:%M %d.%m.%Y")(new Date(d));
//                         }
//                     },
//                     x2Axis: {
//                         tickFormat: function (d) {
//                             return d3.time.format('%d.%m.%Y')(new Date(d));
//                         }
//                     },
//                     yAxis: {
//                         axisLabel: 'Temperature (t)',
//                         tickFormat: function (d) {
//                             return d3.format('.02f')(d);
//                         },
//                         axisLabelDistance: -10
//                     },
//                     //forceY: [-50, 200],
//                     callback: function () {
//
//                         console.log("!!! lineChart callback !!!123123123123");
//                         var shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];
//                         d3.selectAll('.nv-series').each(function (d, i) {
//                             var group = d3.select(this),
//                                 circle = group.select('circle');
//                             var color = circle.style('fill');
//                             circle.remove();
//                             var symbol = group.append('path')
//                                 .attr('d', d3.svg.symbol().type(shapes[i + 1]))
//                                 .style('stroke', color)
//                                 .style('fill', color)
//                                 // ADJUST SIZE AND POSITION
//                                 .attr('transform', 'scale(1.5) translate(-2,0)')
//                         });
//                     }
//                 },
//                 title: {
//                     enable: true,
//                     text: 'Title for Line Chart'
//                 }
//             };
//             const left = getUrlParam('left', window.location.href);
//             const right = getUrlParam('right', window.location.href);
//
//             if (left != null && right != null && left != undefined && right != undefined) {
//                 this.options.chart.brushExtent = [left, right];
//             }
//             // this.data = generateData();
//             this.observableValueService.get().then(i => {
//                 this.data = i;
//             });
//         }
//
//     }
//
//     GraphController.$inject = ['observableValueService'];
//
//     const component = {controller: GraphController, templateUrl: 'blocks/graph/graph.html'};
//
//
//     angular.module('myApp').component('graphComponent', component);
// })();