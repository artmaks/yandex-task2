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

require('./handlers/lectures')(app, db);
require('./handlers/places')(app, db);
require('./handlers/teachers')(app, db);

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