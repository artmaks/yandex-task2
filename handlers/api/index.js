module.exports = function(app, db) {
    // Получить все лекции
    app.get('/api/schedule', function (req, res) {
        const schedule = db.get('schedule').cloneDeep().value();
        res.send(schedule);
    });

    app.get('/api/schools', function (req, res) {
        const schools = db.get('schools').cloneDeep().value();
        res.send(arrayToDict(schools));
    });

    app.get('/api/teachers', function (req, res) {
        const teachers = db.get('teachers').cloneDeep().value();
        res.send(arrayToDict(teachers));
    });

    app.get('/api/places', function (req, res) {
        const places = db.get('places').cloneDeep().value();
        res.send(arrayToDict(places));
    });

    function arrayToDict(array) {
        const result = {};
        array.map(function (val) {
            result[val.id] = val;
        });
        return result;
    }
};