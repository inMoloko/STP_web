(function () {
    let queryDict = {};
    let encoded = location.search;
    encoded.substr(1).split("&").forEach(function (item) {
        queryDict[item.split("=")[0]] = decodeURI(item.split("=")[1]);
    });
    angular.module('myApp').constant('const', {
        // apiServiceBaseUri:  queryDict.local ? 'http://mproduction:8888/': 'http://office.inmoloko.ru:8888/',
        apiServiceBaseUri: 'http://192.168.0.15:8080/api/',
        clientId: 'ngAuthApp'
    });
})();