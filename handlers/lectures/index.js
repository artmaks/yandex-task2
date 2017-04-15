module.exports = function(app, db) {
    // Таблица лекций
    app.get('/schedule', function (req, res) {
        const schedule = db.get('schedule').value();
        schedule.map(function (lecture) {
            const teacher = db.get('teachers').find({'id': lecture.teacher}).value();
            lecture.teacherData = teacher;
        });
        res.render('lectures/schedule', {'schedule': schedule});
    });

    // Страница добавления лекции
    app.get('/new_lecture', function (req, res) {
        res.render('lectures/new_lecture');
    });

    // Обработка добавления лекции
    app.post('/new_lecture', function (req, res) {
        const teacher = db.get('teachers').find({ name : req.body.teacher }).value();
        if(!teacher) {
            res.render('lectures/new_lecture', { error : 'Лектора с именем ' + req.body.teacher + ' не существует в базе' });
            return;
        }

        // Замена имени лектора на id
        req.body.teacher = teacher.id;

        db.get('schedule').insert(req.body).write().then(function (result) {
            res.redirect('/schedule/' + result.id);
        });
    });

    // Страница редактирования лекции по id
    app.get('/schedule/:id', function (req, res) {
        const lecture = db.get('schedule')
            .find({id: req.params.id})
            .value();

        const teacher = db.get('teachers')
            .find({'id': lecture.teacher})
            .value();

        lecture.teacherData = teacher;

        res.render('lectures/lecture', {'lecture': lecture});
    });

    // Обновить экземпляр лекции по id
    app.post('/schedule/:id', function (req, res) {
        const teacher = db.get('teachers').find({ name : req.body.teacher }).value();
        if(!teacher) {
            res.render('lectures/lecture', { error : 'Лектора с именем ' + req.body.teacher + ' не существует в базе', lecture : req.body });
            return;
        }

        // Замена имени лектора на id
        req.body.teacher = teacher.id;

        db.get('schedule').find({id: req.params.id}).assign(req.body).write().then(function (result) {
            res.redirect('/schedule/' + result.id);
        });
    });

    // Удалить экземпляр лекции по id
    app.get('/remove_lecture/:id', function (req, res) {
        db.get('schedule').remove({id: req.params.id}).write();
        res.redirect('/schedule');
    });
};