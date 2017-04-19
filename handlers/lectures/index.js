module.exports = function(app, db) {
    const ScheduleAPI = require('../../api');
    const api = new ScheduleAPI(db);

    // Таблица лекций
    app.get('/admin/schedule', function (req, res) {
        const schedule = api.getFullInfoSchedule(true);

        res.render('lectures/schedule', {'schedule': schedule, 'schedulePage' : true});
    });

    // Страница добавления лекции
    app.get('/admin/new_lecture', function (req, res) {
        res.render('lectures/new_lecture', {'schedulePage' : true});
    });

    // Обработка добавления лекции
    app.post('/admin/new_lecture', function (req, res) {
        req = validateLectureRequest(req, res, 'lectures/new_lecture');
        if(!req)
            return;

        db.get('schedule').insert(req.body).write().then(function (result) {
            res.redirect('/admin/schedule/' + result.id + '/?updated=true');
        });
    });

    // Страница редактирования лекции по id
    app.get('/admin/schedule/:id', function (req, res) {
        const lecture = api.getFullInfoLecture(req.params.id);

        res.render('lectures/lecture', {'lecture': lecture, 'updated' : req.query.updated, 'schedulePage' : true});
    });

    // Обновить экземпляр лекции по id
    app.post('/admin/schedule/:id', function (req, res) {
        req = validateLectureRequest(req, res, 'lectures/lecture');
        if(!req)
            return;

        db.get('schedule').find({id: req.params.id}).assign(req.body).write().then(function (result) {
            res.redirect('/admin/schedule/' + result.id + '/?updated=true');
        });
    });

    // Удалить экземпляр лекции по id
    app.get('/admin/remove_lecture/:id', function (req, res) {
        api.removeLecture(req.params.id);
        res.redirect('/admin/schedule');
    });

    // --------- utils -----------


    // Валидация запроса на изменение / добавление данных
    function validateLectureRequest(req, res, page) {
        const restoreData = function (req) {
            req.body.teacherName = req.body.teacher;
            req.body.placeTitle = req.body.place;
            req.body.schoolInput = req.body.school;
            req.body.id = req.params.id;
        };

        const result = api.validateLectureRequest(req.params.id, req.body);

        if(result.error) {
            restoreData(req);
            res.render(page, { error : result.message, lecture : req.body, 'schedulePage' : true });
            return false;
        }

        // Замена имени лектора на id
        req.body.teacher = result.teacher.id;
        // Замена имени аудитории на id
        req.body.place = result.place.id;
        // Замена имени аудитории на id
        req.body.school = result.schools;

        return req;
    }

};