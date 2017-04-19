module.exports = function(app, db) {
    const ScheduleAPI = require('../../api');
    const api = new ScheduleAPI(db);

    // Таблица лекторов
    app.get('/admin/teachers', function (req, res) {
        const teachers = api.getTeachers();
        res.render('teachers/teachers', {'teachers': teachers, 'teachersPage' : true});
    });

    // Страница добавления лектора
    app.get('/admin/new_teacher', function (req, res) {
        res.render('teachers/new_teacher', {'teachersPage' : true});
    });

    // Обработка добавления лектора
    app.post('/admin/new_teacher', function (req, res) {
        api.addTeacher(req.body).then(function (result) {
            res.redirect('/admin/teachers/' + result.id + '/?updated=true');
        });
    });

    // Страница редактирования лектора по id
    app.get('/admin/teachers/:id', function (req, res) {
        const teacher = api.getTeacher(req.params.id);

        res.render('teachers/teacher', {'teacher': teacher, 'updated' : req.query.updated, 'teachersPage' : true});
    });

    // Обновить экземпляр лектора по id
    app.post('/admin/teachers/:id', function (req, res) {
        api.setTeacher(req.params.id, req.body).then(function (result) {
            res.redirect('/admin/teachers/' + result.id + '/?updated=true');
        });
    });

    // Удалить экземпляр лектора по id
    app.get('/admin/remove_teacher/:id', function (req, res) {
        api.removeTeacher(req.params.id);
        res.redirect('/admin/teachers');
    });
}