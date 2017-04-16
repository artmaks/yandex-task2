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

// Главная страница расписания
app.get('/', function (req, res) {
    res.render('home', {layout : 'front'});
});

// Главная страница админ панели
app.get('/admin', function (req, res) {
    res.render('home', {homePage: true});
});

require('./handlers/lectures')(app, db);
require('./handlers/places')(app, db);
require('./handlers/teachers')(app, db);
require('./handlers/schools')(app, db);

// API handlers
require('./handlers/api')(app, db);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});