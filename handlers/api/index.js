module.exports = function(app, db) {
    // Получить все лекции
    app.get('/api/schedule', function (req, res) {
        const schedule = db.get('schedule').cloneDeep().value();
        res.send(schedule.sort(dateComparatorForLectures));
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

    function dateComparatorForLectures(lecture1, lecture2) {
        const date1 = new Date(lecture1.date);
        const date2 = new Date(lecture2.date);

        if(lecture1.timeStart) {
            const time1 = lecture1.timeStart.split(':');
            date1.setHours(time1[0], time1[1]);
        }

        if(lecture2.timeStart) {
            const time2 = lecture2.timeStart.split(':');
            date2.setHours(time2[0], time2[1]);
        }

        if(date1.getTime() > date2.getTime())
            return 1;

        if(date1.getTime() < date2.getTime())
            return -1;

        return 0;
    }
};