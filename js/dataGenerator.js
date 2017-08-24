
function getRandomArbitary(min, max)
{
    return Math.random() * (max - min) + min;
}

function days(num) {
    return num*60*60*1000*24
}

function generateData() {

    var data = [],
        shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
        random = d3.random.normal();

    var start_date = new Date() - days(365); // One year ago

    for (var i = 0; i < 6; i++) {
        data.push({
            key: 'P7/1, температура, ТЕ ' + (i + 1),
            values: []
        });
        for (var j = 0; j < 100; j++) {
            data[i].values.push({
                x: new Date(start_date + days(j)),
                y: getRandomArbitary(30,100),
                shape: shapes[i + 1]
            });
        }
    }
    return data;
}
