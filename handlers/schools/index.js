module.exports = function(app, db) {
    // Таблица школ
    app.get('/schools', function (req, res) {
        const schools = db.get('schools').value();
        res.render('schools/schools', {'schools': schools});
    });

    // Страница добавления школы
    app.get('/new_school', function (req, res) {
        res.render('schools/new_school');
    });

    // Обработка добавления школы
    app.post('/new_school', function (req, res) {
        db.get('schools').insert(req.body).write().then(function (result) {
            res.redirect('/schools/' + result.id);
        });
    });

    // Страница редактирования школы по id
    app.get('/schools/:id', function (req, res) {
        const school = db.get('schools')
            .find({id: req.params.id})
            .value();

        res.render('schools/school', {'school': school});
    });

    // Обновить экземпляр школы по id
    app.post('/schools/:id', function (req, res) {
        db.get('schools').find({id: req.params.id}).assign(req.body).write().then(function (result) {
            res.redirect('/schools/' + result.id);
        });
    });

    // Удалить экземпляр аудитории по id
    app.get('/remove_school/:id', function (req, res) {
        db.get('schools').remove({id: req.params.id}).write();
        res.redirect('/schools');
    });
};