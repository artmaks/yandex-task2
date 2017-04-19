module.exports = function(app, db) {
    const ScheduleAPI = require('../../api');
    const api = new ScheduleAPI(db);

    // Получить все лекции
    app.get('/api/schedule', function (req, res) {
        const schedule = api.getSchedule(true);
        res.send(schedule);
    });

    app.get('/api/schools', function (req, res) {
        const schools = api.getSchools();
        res.send(arrayToDict(schools));
    });

    app.get('/api/teachers', function (req, res) {
        const teachers = api.getTeachers();
        res.send(arrayToDict(teachers));
    });

    app.get('/api/places', function (req, res) {
        const places = api.getPlaces();
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