# Яндекс мобилизация. Задание №2

Описание задания: https://academy.yandex.ru/events/frontend/shri_msk-2017/

Демонстрация админ-панели: https://yandex-schedule.herokuapp.com/admin/

Демонстрация интеграции с первым заданием: https://yandex-schedule.herokuapp.com/

### Используемые технологии
 * *lowdb* - лекговесная библиотека для работы с базой данных основанной на json файлах. Библиотека была выбрана по причине удобства внедрения в проект. Работа с JSON файлами не требует много ресурсов и прекрасно подходит для хранения маленького объема данных. Применнеие реляционных баз данных я посчитал излишним. Ссылка: https://github.com/typicode/lowdb
 * *Express* - данный проект подразумевает под собой размещение на веб-сервере, так как использование gh-pages, как в первом задании здесь будет неуместным. По этой причине был выбран одноименный веб-фреймворк для организации запросов к серверу.
 * *Express-handlebars* - так как я уже продемонстрировал умение обходиться без шаблонизатора, в данном задании для структурирования кода и удобства проверки было принято решение использовать шаблонизатор Handlebars.
 * *body-parser* - для удобства работы с параметрами запросов в express
 * *lodash-id* - как дополнение к библиотеки lowdb (генерировать уникальные ключи)

Как и в первом задании было решено не использовать сборщики проектов. Минимальные требования к JavaScript не важны. Админ панель работает по принципу серверного рендеринга, на клиенте не выполняется ни одна строчка JavaScript кода.

Также для Админ панели предусмотрен graceful degradation как для JS (который не используется), а также для CSS, отключения которого не сильно повлияет на восприятие и работу с сайтом.

### Библиотека

Для работы с библиотекой необходимо создать инстанс библиотеки, передав инстанс базы данных:

```javascript
    const ScheduleAPI = require('../../api'); // Импорт библиотеки
    const api = new ScheduleAPI(db); // Создание инстанса, необходимо передать экземпляр базы данных lowdb
```

Вспомогательные методы для работы внутри библиотеки:
* get(table)
* add(table, data)
* set(table, id, data)
* getById(table, id)
* joinTeacherAndPlace(lecture)
* getLecturesByPlaceAndDate(place, date)
* getIntersectsLectures(place, date, timeStart, timeEnd, id)
* validateLectureRequest(id, data)

Методы для работы с расписанием:
* getSchedule(sorted)
* getLecture(id)
* addLecture(data)
* removeLecture(id)
* setLecture(id, data)
* getFullInfoLecture(id)
* getFullInfoSchedule(sorted)

Методы для работы с аудиториями:

* getPlaces()
* addPlace(data)
* removePlace(id)
* getPlace(id)
* setPlace(id, data)

Методы для работы со школами:

* getSchools()
* addSchool(data)
* removeSchool(id)
* getSchool(id)
* setSchool(id, data)

Методы для работы с лекторами:

* getTeachers()
* addTeacher(data)
* removeTeacher(id)
* getTeacher(id)
* setTeacher(id, data)

### Панель управления

Для демонстрации работы библиотеки была написана специальная админ-панель, которая позволяет производить полноценный CRUD для управления базой данных.


Для связи с первым заданием был разработан REST API который позволяет получать данные из библиотеки. API было успешно интегрированно.
