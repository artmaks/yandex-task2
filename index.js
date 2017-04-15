const express = require('express');
const app = express();
const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async')
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

const db = low('db.json', {
    storage: fileAsync
});
db._.mixin(require('lodash-id'));

db.defaults({ posts: [] })
    .write();

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Главная страница
app.get('/', function (req, res) {
    res.render('home');
});

// Таблица лекций
app.get('/schedule', function (req, res) {
    const schedule = db.get('schedule').value();
    res.render('schedule', { 'schedule' : schedule });
});

// Таблица лекторов
app.get('/teachers', function (req, res) {
    const teachers = db.get('teachers').value();
    res.render('teachers', { 'teachers' : teachers });
});

// Страница добавления лекции
app.get('/new_lecture', function (req, res) {
    res.render('new_lecture');
});

// Страница добавления лектора
app.get('/new_teacher', function (req, res) {
    res.render('new_teacher');
});

// Обработка добавления лекции
app.post('/new_lecture', function (req, res) {
    db.get('schedule').insert(req.body).write();
    res.redirect('/schedule');
});

// Обработка добавления лектора
app.post('/new_teacher', function (req, res) {
    db.get('teachers').insert(req.body).write();
    res.redirect('/teachers');
});

// Страница редактирования лекции по id
app.get('/schedule/:id',  function (req, res) {
    const lecture = db.get('schedule')
        .find({ id: req.params.id })
        .value();

    res.render('lecture', { 'lecture' : lecture });
});

// Страница редактирования лектора по id
app.get('/teachers/:id',  function (req, res) {
    const teacher = db.get('teachers')
        .find({ id: req.params.id })
        .value();

    res.render('teacher', { 'teacher' : teacher });
});

// Обновить экземпляр лекции по id
app.post('/schedule/:id',  function (req, res) {
    db.get('schedule').find({ id : req.params.id }).assign(req.body).write();
    res.redirect('/schedule');
});

// Обновить экземпляр лектора по id
app.post('/teachers/:id',  function (req, res) {
    db.get('teachers').find({ id : req.params.id }).assign(req.body).write();
    res.redirect('/teachers');
});

// Удалить экземпляр лекции по id
app.get('/remove_lecture/:id',  function (req, res) {
    db.get('schedule').remove({ id : req.params.id }).write();
    res.redirect('/schedule');
});

// Удалить экземпляр лектора по id
app.get('/remove_teacher/:id',  function (req, res) {
    db.get('teachers').remove({ id : req.params.id }).write();
    res.redirect('/teachers');
});


// Тестовая инициализация таблицы бд
app.get('/setTest', function (req, res) {
    db.get('schedule')
        .push({
            title: "Лекция 1. Адаптивная вёрстка",
            school: "Школа разработки интерфейсов",
            teacher: "Дмитрий Душкин",
            date: "03/03/2017",
            place: "Синий кит"
        })
        .write()
        .then(function (post) {
            res.send(post)
        });
});

// Тестовая функция чтения таблицы БД
app.get('/getTest', function (req, res) {
    const post = db.get('schedule').value();
    res.send(post);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});