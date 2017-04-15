module.exports = function(app, db) {
    // Таблица лекций
    app.get('/schedule', function (req, res) {
        const schedule = getSchedule();
        schedule.map(function (lecture) {
            joinTeacherAndPlace(lecture);
        });
        res.render('lectures/schedule', {'schedule': schedule});
    });

    // Страница добавления лекции
    app.get('/new_lecture', function (req, res) {
        res.render('lectures/new_lecture');
    });

    // Обработка добавления лекции
    app.post('/new_lecture', function (req, res) {
        req = validateLectureRequest(req, res, 'lectures/new_lecture');
        if(!req)
            return;

        db.get('schedule').insert(req.body).write().then(function (result) {
            res.redirect('/schedule/' + result.id);
        });
    });

    // Страница редактирования лекции по id
    app.get('/schedule/:id', function (req, res) {
        const lecture = getLectureById(req.params.id);
        joinTeacherAndPlace(lecture);

        res.render('lectures/lecture', {'lecture': lecture});
    });

    // Обновить экземпляр лекции по id
    app.post('/schedule/:id', function (req, res) {
        req = validateLectureRequest(req, res, 'lectures/lecture');
        if(!req)
            return;

        db.get('schedule').find({id: req.params.id}).assign(req.body).write().then(function (result) {
            res.redirect('/schedule/' + result.id);
        });
    });

    // Удалить экземпляр лекции по id
    app.get('/remove_lecture/:id', function (req, res) {
        removeLecture(req.params.id);
        res.redirect('/schedule');
    });

    // --------- utils -----------

    // Аналог JOIN в SQL (присоединить данные лектора и аудитории к лекции)
    function joinTeacherAndPlace(lecture) {
        const teacher = db.get('teachers').find({'id': lecture.teacher}).value();
        const place = db.get('places').find({'id': lecture.place}).value();
        lecture.teacherName = teacher ? teacher.name : '';
        lecture.placeTitle = place ? place.title : '';
    }

    // Валидация запроса на изменение / добавление данных
    function validateLectureRequest(req, res, page) {
        const teacher = db.get('teachers').find({ name : req.body.teacher }).value();
        const place = db.get('places').find({ title : req.body.place }).value();
        if(!teacher) {
            req.body.teacherName = req.body.teacher;
            req.body.placeTitle = req.body.place;
            req.body.id = req.params.id;
            res.render(page, { error : 'Лектора с именем ' + req.body.teacher + ' не существует в базе', lecture : req.body });
            return false;
        }
        if(!place) {
            req.body.teacherName = req.body.teacher;
            req.body.placeTitle = req.body.place;
            req.body.id = req.params.id;
            res.render(page, { error : 'Аудитории с именем ' + req.body.place + ' не существует в базе', lecture : req.body });
            return false;
        }

        // Замена имени лектора на id
        req.body.teacher = teacher.id;
        // Замена имени аудитории на id
        req.body.place = place.id;

        return req;
    }

    // Получить лекцию по id
    function getLectureById(id) {
        return db.get('schedule')
            .find({id: id})
            .cloneDeep()
            .value();
    }

    // Получить все лекции из БД
    function getSchedule() {
        return db.get('schedule').cloneDeep().value();
    }

    function removeLecture(id) {
        return db.get('schedule').remove({id: id}).write();
    }
};