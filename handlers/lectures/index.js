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


        res.render('lectures/lecture', {'lecture': lecture, 'updated' : req.query.updated});
    });

    // Обновить экземпляр лекции по id
    app.post('/schedule/:id', function (req, res) {
        req = validateLectureRequest(req, res, 'lectures/lecture');
        if(!req)
            return;

        db.get('schedule').find({id: req.params.id}).assign(req.body).write().then(function (result) {
            res.redirect('/schedule/' + result.id + '/?updated=true');
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
        const school = db.get('schools').find({'id': lecture.school}).value();
        lecture.teacherName = teacher ? teacher.name : '';
        lecture.placeTitle = place ? place.title : '';
        lecture.schoolTitle = school ? school.title : '';
    }

    // Валидация запроса на изменение / добавление данных
    function validateLectureRequest(req, res, page) {
        const teacher = db.get('teachers').find({ name : req.body.teacher }).value();
        const place = db.get('places').find({ title : req.body.place }).value();
        const school = db.get('schools').find({ title : req.body.school }).value();

        const restoreData = function (req) {
            req.body.teacherName = req.body.teacher;
            req.body.placeTitle = req.body.place;
            req.body.schoolTitle = req.body.school;
            req.body.id = req.params.id;
        };

        if(!teacher) {
            restoreData(req);
            res.render(page, { error : 'Лектора с именем "' + req.body.teacher + '" не существует в базе', lecture : req.body });
            return false;
        }
        if(!place) {
            restoreData(req);
            res.render(page, { error : 'Аудитории с именем "' + req.body.place + '" не существует в базе', lecture : req.body });
            return false;
        }
        if(!school) {
            restoreData(req);
            res.render(page, { error : 'Школы с именем "' + req.body.school + '" не существует в базе', lecture : req.body });
            return false;
        }
        if(parseInt(school.members) > parseInt(place.capacity)) {
            restoreData(req);
            res.render(page, { error : 'Аудитория "' + place.title + '" вмещает максимум ' + place.capacity + ' человек. ' +
            'В школе "' + school.title + '" ' + school.members + ' человек', lecture : req.body });
            return false;
        }

        // Замена имени лектора на id
        req.body.teacher = teacher.id;
        // Замена имени аудитории на id
        req.body.place = place.id;
        // Замена имени аудитории на id
        req.body.school = school.id;

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