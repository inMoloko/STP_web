(function () {
    class TreeController {
        constructor($linq, $timeout) {
            this.$timeout = $timeout;
            this.$linq = $linq;
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

        }

        $onInit() {

        }

    }

    TreeController
        .$inject = ['$linq', '$timeout'];

    const
        component = {
            controller: TreeController, templateUrl: 'blocks/tree/tree.html', bindings: {
                'paramsList': '='
            }
        };


    angular
        .module(
            'myApp'
        ).component('treeComponent', component);
})();