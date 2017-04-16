module.exports = function(app, db) {
    // Таблица лекторов
    app.get('/teachers', function (req, res) {
        const teachers = db.get('teachers').value();
        res.render('teachers/teachers', {'teachers': teachers, 'teachersPage' : true});
    });

    // Страница добавления лектора
    app.get('/new_teacher', function (req, res) {
        res.render('teachers/new_teacher', {'teachersPage' : true});
    });

    // Обработка добавления лектора
    app.post('/new_teacher', function (req, res) {
        db.get('teachers').insert(req.body).write().then(function (result) {
            res.redirect('/teachers/' + result.id);
        });
    });

    // Страница редактирования лектора по id
    app.get('/teachers/:id', function (req, res) {
        const teacher = db.get('teachers')
            .find({id: req.params.id})
            .value();

        res.render('teachers/teacher', {'teacher': teacher, 'updated' : req.query.updated, 'teachersPage' : true});
    });

    // Обновить экземпляр лектора по id
    app.post('/teachers/:id', function (req, res) {
        db.get('teachers').find({id: req.params.id}).assign(req.body).write().then(function (result) {
            res.redirect('/teachers/' + result.id + '/?updated=true');
        });
    });

    // Удалить экземпляр лектора по id
    app.get('/remove_teacher/:id', function (req, res) {
        db.get('teachers').remove({id: req.params.id}).write();
        res.redirect('/teachers');
    });
}