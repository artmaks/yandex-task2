function dateComparatorForLectures(lecture1, lecture2) {
    const date1 = new Date(lecture1.date);
    const date2 = new Date(lecture2.date);

    if(lecture1.timeStart) {
        const time1 = lecture1.timeStart.split(':');
        date1.setHours(time1[0], time1[1]);
    }

    if(lecture2.timeStart) {
        const time2 = lecture2.timeStart.split(':');
        date2.setHours(time2[0], time2[1]);
    }

    if(date1.getTime() > date2.getTime())
        return 1;

    if(date1.getTime() < date2.getTime())
        return -1;

    return 0;
};

// Дата в строку
function getFormatDate(string_date) {
    const date = new Date(string_date);
    if(isNaN(date.getTime()))
        return '';

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

// Проверить что дата не меньше чем сегодня
function noLessThenToday(date) {
    const today = new Date();
    const dateInstance = new Date(date);
    today.setHours(0,0,0,0);
    dateInstance.setHours(0,0,0,0);
    return today.getTime() <= dateInstance.getTime();
}

function generateError(message) {
    return {
        error: true,
        message: message
    }
}

function isIntervalsIntersects(start1, end1, start2, end2) {
    if( (start1 >= start2 && start1 <= end2) || (start2 >= start1 && start2 <= end1) ) {
        return true;
    } else {
        return false;
    }
}

function getDateWithTime(date, time) {
    const res = new Date(date);
    if(time) {
        const timeSplitted = time.split(':');
        res.setHours(timeSplitted[0], timeSplitted[1]);
    }
    return res;
}

// Проверить строку с датой на валидность
function isDate(date) {
    const dateParts = date.split('/');
    if(dateParts.length !== 3 || parseInt(dateParts[0]) > 12 || parseInt(dateParts[0]) < 1
        || parseInt(dateParts[1]) > 31 || parseInt(dateParts[1]) < 1 || dateParts[2].length != 4 ) {
        return false;
    }

    const dateInstance = new Date(date);
    return !isNaN(dateInstance.getTime());
}

module.exports = {
    dateComparatorForLectures,
    getFormatDate,
    noLessThenToday,
    generateError,
    isIntervalsIntersects,
    getDateWithTime,
    isDate
};