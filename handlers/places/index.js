module.exports = function(app, db) {
    const ScheduleAPI = require('../../api');
    const api = new ScheduleAPI(db);

    // Таблица аудиторий
    app.get('/admin/places', function (req, res) {
        const places = api.getPlaces();
        res.render('places/places', {'places': places, 'placesPage' : true});
    });

    // Страница добавления аудитории
    app.get('/admin/new_place', function (req, res) {
        res.render('places/new_place', {'placesPage' : true});
    });

    // Обработка добавления аудитории
    app.post('/admin/new_place', function (req, res) {
        api.addPlace(req.body).then(function (result) {
            res.redirect('/admin/places/' + result.id + '/?updated=true');
        });
    });

    // Страница редактирования аудитории по id
    app.get('/admin/places/:id', function (req, res) {
        const place = api.getPlace(req.params.id);

        res.render('places/place', {'place': place, 'updated' : req.query.updated, 'placesPage' : true});
    });

    // Обновить экземпляр аудитории по id
    app.post('/admin/places/:id', function (req, res) {
        api.setPlace(req.params.id, req.body).then(function (result) {
            res.redirect('/admin/places/' + result.id + '/?updated=true');
        });
    });

    // Удалить экземпляр аудитории по id
    app.get('/admin/remove_place/:id', function (req, res) {
        api.removePlace(req.params.id);
        res.redirect('/admin/places');
    });
}