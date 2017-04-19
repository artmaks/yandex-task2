module.exports = function(app, db) {
    const ScheduleAPI = require('../../api');
    const api = new ScheduleAPI(db);

    // Таблица школ
    app.get('/admin/schools', function (req, res) {
        const schools = api.getSchools();
        res.render('schools/schools', {'schools': schools, 'schoolsPage' : true});
    });

    // Страница добавления школы
    app.get('/admin/new_school', function (req, res) {
        res.render('schools/new_school', {'schoolsPage' : true});
    });

    // Обработка добавления школы
    app.post('/admin/new_school', function (req, res) {
        api.addSchool(req.body).then(function (result) {
            res.redirect('/admin/schools/' + result.id + '/?updated=true');
        });
    });

    // Страница редактирования школы по id
    app.get('/admin/schools/:id', function (req, res) {
        const school = api.getSchool(req.params.id);

        res.render('schools/school', {'school': school, 'updated' : req.query.updated, 'schoolsPage' : true});
    });

    // Обновить экземпляр школы по id
    app.post('/admin/schools/:id', function (req, res) {
        api.setSchool(req.params.id, req.body).then(function (result) {
            res.redirect('/admin/schools/' + result.id + '/?updated=true');
        });
    });

    // Удалить экземпляр аудитории по id
    app.get('/admin/remove_school/:id', function (req, res) {
        api.removeSchool(req.params.id);
        res.redirect('/admin/schools');
    });
};