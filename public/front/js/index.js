var schedule = [];
var teachers = {};
var schools = {};
var places = {};

var currentSchool = '';
var showFinishedLectures = false;

function clearHTML(element) {
    element.innerHTML = '';
}

function setHTML(element, html) {
    element.innerHTML = html;
}

function getItemObjectHTML() {
    const template = document.getElementById('template-item').cloneNode(true);;
    template.id = '';
    return template;
}

function getFormatDate(date) {
    var monthNames = [
        "Января", "Февраля", "Марта",
        "Апреля", "Мая", "Июня", "Июля",
        "Августа", "Сентября", "Октября",
        "Ноября", "Декабря"
    ];

    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[month] + ' ' + year;
}

function getScheduleForTeacher(data, name) {
    return data.filter(function (a) {
        if(a.teacher.indexOf(name) !== -1) {
            return true;
        }
    });
}

function getScheduleForSchool(data) {
    return data.filter(function (a) {
        if(a.school.indexOf(currentSchool) !== -1) {
            return true;
        }
    });
}

function filterScheduleByDate(data, date, comparator) {
    return data.filter(function (a) {
        const itemDate = new Date(a.date);
        itemDate.setHours(0,0,0,0);
        date.setHours(0,0,0,0);
        if(comparator(itemDate.getTime(), date.getTime())) {
            return true;
        }
    });
}

function getScheduleMinDate(data, date) {
    return filterScheduleByDate(data, date, function (date1, date2) {
        return date1 >= date2;
    });
}

function getScheduleMaxDate(data, date) {
    return filterScheduleByDate(data, date, function (date1, date2) {
        return date1 <= date2;
    });
}

function setupItem(item, data) {
    const title = item.querySelector('.title');
    const school = item.querySelector('.school');
    const teacher = item.querySelector('.teacher-text');
    const date = item.querySelector('.date-text');
    const place = item.querySelector('.place-text');
    const materials = item.querySelector('.materials-text');

    const teacherName = item.querySelector('.name');
    const teacherAbout = item.querySelector('.about');
    const teacherPhoto = item.querySelector('.teacher-photo');

    const itemDate = new Date(data.date);
    const strDate = getFormatDate(itemDate);
    teacherData = teachers[data.teacher];

    if(itemDate.getTime() < (new Date()).getTime()) {
        setHTML(materials, '<a href="#">Материалы</a>');
        item.querySelector('.materials .icon-materials').style.display = 'block';
        title.classList.add('finished');
        if(!showFinishedLectures)
            return document.createElement('div');
    }

    if(teacherData) {
        setHTML(teacherName, teachers[data.teacher].name);
        setHTML(teacherAbout, teacherData.about);
        teacherPhoto.src = '/front/assets/imgs/teachers/' + teacherData.photo;
    } else {
        const tooltip = item.querySelector('.tooltiptext');
        tooltip.parentNode.removeChild(tooltip);
    }

    setHTML(title, data.title);
    setHTML(school, schools[data.school].title);
    setHTML(teacher, teachers[data.teacher].name);
    setHTML(place, places[data.place].title);
    setHTML(date, strDate);
    setHTML(name, teacher);

    return item;
}

function showList(list, data) {
    clearHTML(list);
    
    if(data.length > 0) {
        data.map(function (a) {
            list.appendChild(setupItem(getItemObjectHTML(), a));
        });
    } else {
        setHTML(list, '<div class="empty">Не существует лекций для выбранных фильтров.</div>')
    }
}

function getFilteredData(data, name, date1, date2) {
    var filtered = getScheduleForTeacher(data, name);
    filtered = getScheduleForSchool(filtered);
    filtered = !isNaN(date1.getTime()) ? getScheduleMinDate(filtered, date1) : filtered;
    filtered = !isNaN(date2.getTime()) ? getScheduleMaxDate(filtered, date2) : filtered;
    return filtered;
}

function getRequest(URL, success) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
    xhr.send();
    xhr.addEventListener("readystatechange", function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            success(response);
        }
    }, false);
}

document.addEventListener("DOMContentLoaded", function(event) {

    const list = document.getElementById('list');
    const tabs = document.getElementById('tabs');
    const form = document.getElementById('filters-form');
    const searchInput = document.getElementById('search-input');
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    const showFinished = document.querySelector('.show-finished');
    const tabItems = Array.prototype.slice.call(tabs.querySelectorAll('.tab')); // convert to real array (for map function)


    getRequest("http://localhost:3000/api/teachers", function (result) {
        teachers = result;
        console.log(result);
        showList(list, schedule);
    });
    getRequest("http://localhost:3000/api/places", function (result) {
        places = result;
        console.log(result);
        showList(list, schedule);
    });
    getRequest("http://localhost:3000/api/schools", function (result) {
        schools = result;
        console.log(result);
        showList(list, schedule);
    });
    getRequest("http://localhost:3000/api/schedule", function (result) {
        schedule = result;
        console.log(result);
        showList(list, schedule);
    });

    form.addEventListener("submit", function(event) {
        event.preventDefault();
    });

    searchInput.addEventListener("change", function (event) {
        const searchInputValue = searchInput.value;
        const dateFromValue = new Date(dateFrom.value);
        const dateToValue = new Date(dateTo.value);

        const filtered = getFilteredData(schedule, searchInputValue, dateFromValue, dateToValue);
        showList(list, filtered);
    });

    dateFrom.addEventListener("change", function (event) {
        const searchInputValue = searchInput.value;
        const dateFromValue = new Date(dateFrom.value);
        const dateToValue = new Date(dateTo.value);

        const filtered = getFilteredData(schedule, searchInputValue, dateFromValue, dateToValue);
        showList(list, filtered);
    });

    dateTo.addEventListener("change", function (event) {
        const searchInputValue = searchInput.value;
        const dateFromValue = new Date(dateFrom.value);
        const dateToValue = new Date(dateTo.value);

        const filtered = getFilteredData(schedule, searchInputValue, dateFromValue, dateToValue);
        showList(list, filtered);
    });

    tabItems.map(function (tab) {
        tab.addEventListener("click", function () {
            currentSchool = this.getAttribute("school");
            const searchInputValue = searchInput.value;
            const dateFromValue = new Date(dateFrom.value);
            const dateToValue = new Date(dateTo.value);

            const filtered = getFilteredData(schedule, searchInputValue, dateFromValue, dateToValue);
            showList(list, filtered);

            tabItems.map(function (a) {
                a.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    showFinished.addEventListener("click", function (event) {
        event.preventDefault();
        showFinishedLectures = !showFinishedLectures;
        console.log(showFinishedLectures)
        this.text = showFinishedLectures ? 'Скрыть прошедшие лекции' : 'Показать прошедшие лекции';

        const searchInputValue = searchInput.value;
        const dateFromValue = new Date(dateFrom.value);
        const dateToValue = new Date(dateTo.value);

        const filtered = getFilteredData(schedule, searchInputValue, dateFromValue, dateToValue);
        showList(list, filtered);
    });

});