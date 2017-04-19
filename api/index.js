const utils = require('./utils');

class ScheduleAPI {
    constructor(db) {
        this.db = db;
    }

    //------------ Core ----------------------

    get(table) {
        return this.db.get(table).cloneDeep().value();
    }

    add(table, data) {
        return this.db.get(table).insert(data).write();
    }

    set(table, id, data) {
        return this.db.get(table).find({id: id}).assign(data).write();
    }

    getById(table, id) {
        return this.db.get(table).find({id: id}).cloneDeep().value();
    }


    //------------ Schedule --------------------

    getSchedule(sorted) {
        const schedule = this.get('schedule');
        return sorted ? schedule.sort(utils.dateComparatorForLectures) : schedule;
    }

    getLecture(id) {
        return this.getById('schedule', id);
    }

    removeLecture(id) {
        this.db.get('schedule').remove({id: id}).write();
        return true;
    }

    getFullInfoLecture(id) {
        const lecture = this.getLecture(id);
        this.joinTeacherAndPlace(lecture);
        return lecture;
    }

    getFullInfoSchedule(sorted) {
        const schedule = this.getSchedule(sorted);
        schedule.map(function (lecture) {
            return this.joinTeacherAndPlace(lecture);
        }.bind(this));
        return schedule;
    }

    // Аналог JOIN в SQL (присоединить данные лектора и аудитории к лекции)
    joinTeacherAndPlace(lecture) {
        const schools = [];
        lecture.school.map(function (id) {
            const school = this.getSchool(id);
            schools.push(school);
        }.bind(this));

        const teacher = this.getTeacher(lecture.teacher);
        const place = this.getPlace(lecture.place);
        lecture.teacherName = teacher ? teacher.name : '';
        lecture.placeTitle = place ? place.title : '';
        lecture.schoolsData = schools ? schools : [];
        lecture.dateString = utils.getFormatDate(lecture.date);
        lecture.status = utils.noLessThenToday(lecture.date) ? 'Будет' : 'Закончилась';
    }


    getLecturesByPlaceAndDate(place, date) {
        const place_id = this.db.get('places').find({'title': place}).value().id;
        return this.db.get('schedule').filter({ date: date, place: place_id}).cloneDeep().value();
    }

    getIntersectsLectures(place, date, timeStart, timeEnd, id) {
        const schedule = this.getLecturesByPlaceAndDate(place, date);
        const newStart = utils.getDateWithTime(date, timeStart).getTime();
        const newEnd = utils.getDateWithTime(date, timeEnd).getTime();

        if(!schedule)
            return [];

        const filtered_lectures = schedule.filter(function (item) {
            const itemStart = utils.getDateWithTime(item.date, item.timeStart).getTime();
            const itemEnd = utils.getDateWithTime(item.date, item.timeEnd).getTime();

            console.log(item);
            console.log(id);

            if(item.id !== id && utils.isIntervalsIntersects(newStart, newEnd, itemStart, itemEnd)) {
                return true;
            }
        });

        return filtered_lectures;
    }

    validateLectureRequest(id, data) {
        const teacher = this.db.get('teachers').find({name: data.teacher}).cloneDeep().value();
        const place = this.db.get('places').find({title: data.place}).cloneDeep().value();

        const schools = [];
        var schoolMembers = 0;
        const schoolTitles = data.school.split(',').filter(function(el) {return el.length != 0});

        // Цикл применяется для вызова return (в map не работает)
        for(var i in schoolTitles) {
            const title = schoolTitles[i].trim();
            const school = this.db.get('schools').find({ title : title }).cloneDeep().value();

            if(!school) {
                return utils.generateError(`Школы с именем ${title} не существует в базе`);
            }
            schools.push(school.id);
            schoolMembers += parseInt(school.members);
        }

        if(!teacher) {
            return utils.generateError(`Лектора с именем ${data.teacher} не существует в базе`);
        }
        if(!place) {
            return utils.generateError(`Аудитории с именем ${data.place} не существует в базе`);
        }
        if(schoolMembers > parseInt(place.capacity)) {
            return utils.generateError(`Аудитория ${place.title} вмещает максимум  ${place.capacity} человек. 
            В выбранных школах ${schoolMembers} человек`);
        }
        if(!utils.isDate(data.date) || !utils.noLessThenToday(data.date)) {
            return utils.generateError('Дата должна быть в формате (mm/dd/yyyy) и в настоящем времени.');
        }

        const intersectsLectures = this.getIntersectsLectures(data.place, data.date, data.timeStart, data.timeEnd, id);
        if(intersectsLectures.length > 0) {
            var response = '';
            intersectsLectures.map(function (item, key) {
                if(key !== 0) response += ', ';
                response += '"' + item.title + '"';
            });
            return utils.generateError(`К сожалению аудитория ${data.place} в это время уже занята следующими лекциями: ${response}`);
        }

        return {
            success: true,
            teacher: teacher,
            place: place,
            schools: schools
        }
    }

    //------------ Places ----------------------

    getPlaces() {
        return this.get('places');
    }

    addPlace(data) {
        return this.add('places', data);
    }

    removePlace(id) {
        this.db.get('places').remove({id: id}).write();
        return true;
    }

    getPlace(id) {
        return this.getById('places', id);
    }

    setPlace(id, data) {
        return this.set('places', id, data);
    }

    //------------ Schools ----------------------

    getSchools() {
        return this.get('schools');
    }

    addSchool(data) {
        return this.add('schools', data);
    }

    removeSchool(id) {
        this.db.get('schools').remove({id: id}).write();
        return true;
    }

    getSchool(id) {
        return this.getById('schools', id);
    }

    setSchool(id, data) {
        return this.set('schools', id, data);
    }

    //------------ Teachers ---------------------

    getTeachers() {
        return this.get('teachers');
    }

    addTeacher(data) {
        return this.add('teachers', data);
    }

    removeTeacher(id) {
        this.db.get('teachers').remove({id: id}).write();
        return true;
    }

    getTeacher(id) {
        return this.getById('teachers', id);
    }

    setTeacher(id, data) {
        return this.set('teachers', id, data);
    }

}

module.exports = ScheduleAPI;