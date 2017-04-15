module.exports = function(app, db) {
    // Таблица аудиторий
    app.get('/places', function (req, res) {
        const places = db.get('places').value();
        res.render('places/places', {'places': places});
    });

    // Страница добавления аудитории
    app.get('/new_place', function (req, res) {
        res.render('places/new_place');
    });

    // Обработка добавления аудитории
    app.post('/new_place', function (req, res) {
        db.get('places').insert(req.body).write();
        res.redirect('/places');
    });

    // Страница редактирования аудитории по id
    app.get('/places/:id', function (req, res) {
        const place = db.get('places')
            .find({id: req.params.id})
            .value();

        res.render('places/place', {'place': place});
    });

    // Обновить экземпляр аудитории по id
    app.post('/places/:id', function (req, res) {
        db.get('places').find({id: req.params.id}).assign(req.body).write();
        res.redirect('/places');
    });

    // Удалить экземпляр аудитории по id
    app.get('/remove_place/:id', function (req, res) {
        db.get('places').remove({id: req.params.id}).write();
        res.redirect('/places');
    });
}