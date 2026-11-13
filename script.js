/* ==================================
   НАСТРОЙКА ТЕМЫ
================================== */

const themeButton = document.getElementById("themeButton");

// Загружаем сохранённую тему
const savedTheme = localStorage.getItem("bilbyTheme");

if (savedTheme === "day") {
    document.body.classList.add("day");
}

function updateThemeButton() {
    if (document.body.classList.contains("day")) {
        themeButton.textContent = "🌙 НОЧЬ";
    } else {
        themeButton.textContent = "☀ ДЕНЬ";
    }
}

updateThemeButton();

themeButton.addEventListener("click", () => {

    document.body.classList.toggle("day");

    const isDay = document.body.classList.contains("day");

    localStorage.setItem(
        "bilbyTheme",
        isDay ? "day" : "night"
    );

    updateThemeButton();
});


/* ==================================
   ДАННЫЕ ЭКСПЕДИЦИИ
================================== */

const places = {

    dunes: {
        title: "Песчаные дюны",
        description:
            "Перед тобой огромные песчаные холмы. Ветер постоянно меняет их форму, словно пустыня никогда не стоит на месте.",
        status: "МЕСТО ИССЛЕДОВАНО",
        diaryTitle: "Бесконечные дюны",
        diaryText:
            "Первое открытие экспедиции. Песчаные дюны простираются далеко за горизонт."
    },

    cave: {
        title: "Старая пещера",
        description:
            "Небольшая пещера скрывается среди камней. Здесь прохладнее, чем снаружи. Кажется, это хорошее место для отдыха.",
        status: "МЕСТО ИССЛЕДОВАНО",
        diaryTitle: "Укрытие среди камней",
        diaryText:
            "В пустыне нашлось небольшое укрытие. Иногда самое важное — просто найти безопасное место."
    },

    oasis: {
        title: "Затерянный оазис",
        description:
            "Среди сухих песков неожиданно обнаружилось небольшое зелёное место. Здесь есть вода и растения.",
        status: "МЕСТО ИССЛЕДОВАНО",
        diaryTitle: "Неожиданная находка",
        diaryText:
            "Оазис стал одним из самых приятных открытий экспедиции. Даже посреди пустыни есть жизнь."
    },

    tracks: {
        title: "Неизвестные следы",
        description:
            "На песке видна цепочка маленьких следов. Они ведут в сторону скал. Кто-то совсем недавно прошёл здесь.",
        status: "МЕСТО ИССЛЕДОВАНО",
        diaryTitle: "Следы на песке",
        diaryText:
            "Обнаружены неизвестные следы. Возможно, в этой части пустыни есть ещё кто-то."
    },

    secret: {
        title: "Секретное место",
        description:
            "Ты нашёл скрытое место! Здесь находится небольшой знак, оставленный предыдущим путешественником. Кажется, экспедиция завершена не зря.",
        status: "СЕКРЕТ НАЙДЕН",
        diaryTitle: "Последняя загадка",
        diaryText:
            "Самая необычная находка экспедиции. Иногда стоит внимательно смотреть по сторонам, чтобы заметить то, что скрыто от других."
    }

};


/* ==================================
   СОХРАНЕНИЕ ПРОГРЕССА
================================== */

let discovered = [];

try {
    const savedProgress = JSON.parse(
        localStorage.getItem("bilbyProgress")
    );

    if (Array.isArray(savedProgress)) {
        discovered = savedProgress.filter(
            id => Object.hasOwn(places, id)
        );
    }
} catch (error) {
    discovered = [];
}

const TOTAL_PLACES = 5;

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const secretPoint = document.getElementById("secretPoint");
const secretHint = document.getElementById("secretHint");


/* ==================================
   ОБНОВЛЕНИЕ ПРОГРЕССА
================================== */

function updateProgress() {

    const count = discovered.length;

    progressText.textContent =
        `${count} / ${TOTAL_PLACES} НАЙДЕНО`;

    progressFill.style.width =
        `${count / TOTAL_PLACES * 100}%`;

    // После трёх обычных открытий появляется секрет
    const ordinaryCount = discovered.filter(
        id => id !== "secret"
    ).length;

    if (ordinaryCount >= 3) {
        secretPoint.hidden = false;

        secretHint.textContent =
            "На карте обнаружена новая точка. Кажется, ты нашёл что-то необычное!";
    }

    // Если секрет уже найден, повторно открывать его не нужно
    if (discovered.includes("secret")) {
        secretPoint.hidden = false;
        secretHint.textContent =
            "Все тайны пустыни раскрыты. Экспедиция завершена!";
    }

    // Обновляем внешний вид уже найденных мест
    document.querySelectorAll(".map-point").forEach(point => {

        const id = point.dataset.place;

        point.classList.toggle(
            "found",
            discovered.includes(id)
        );

    });
}


/* ==================================
   ДНЕВНИК
================================== */

const diaryList = document.getElementById("diaryList");

function updateDiary() {

    // Удаляем старые записи, оставляя начальную
    const entries = diaryList.querySelectorAll(
        ".diary-entry:not(.initial-entry)"
    );

    entries.forEach(entry => entry.remove());

    // Создаём записи для каждого найденного места
    discovered.forEach(id => {

        const place = places[id];

        const entry = document.createElement("article");
        entry.className = "diary-entry";

        const number = document.createElement("span");
        number.textContent = "DISCOVERED";

        const title = document.createElement("h3");
        title.textContent = place.diaryTitle;

        const description = document.createElement("p");
        description.textContent = place.diaryText;

        const status = document.createElement("span");
        status.className = "entry-status";
        status.textContent = "ЗАПИСЬ СОХРАНЕНА";

        entry.append(
            number,
            title,
            description,
            status
        );

        diaryList.appendChild(entry);

    });

    // Сообщение о завершении
    if (discovered.length === TOTAL_PLACES) {

        const completion = document.createElement("article");
        completion.className = "diary-entry";

        completion.innerHTML = `
            <span>FINAL REPORT</span>
            <h3>Экспедиция завершена!</h3>
            <p>
                Все пять точек исследованы.
                Ты раскрыл секрет пустыни и завершил путешествие.
            </p>
            <span class="entry-status">100% COMPLETE</span>
        `;

        diaryList.appendChild(completion);
    }
}


/* ==================================
   ИССЛЕДОВАНИЕ МЕСТ
================================== */

const mapPoints = document.querySelectorAll(".map-point");

const storyTitle = document.getElementById("storyTitle");
const storyText = document.getElementById("storyText");
const storyStatus = document.getElementById("storyStatus");

mapPoints.forEach(point => {

    point.addEventListener("click", () => {

        const id = point.dataset.place;

        const place = places[id];

        // Проверяем, что место существует
        if (!place) return;

        // Показываем историю
        storyTitle.textContent = place.title;
        storyText.textContent = place.description;
        storyStatus.textContent = place.status;

        // Добавляем место в список открытых
        if (!discovered.includes(id)) {

            discovered.push(id);

            localStorage.setItem(
                "bilbyProgress",
                JSON.stringify(discovered)
            );

            updateProgress();
            updateDiary();

        } else {

            storyStatus.textContent =
                "ТЫ УЖЕ ИССЛЕДОВАЛ ЭТО МЕСТО";

        }

        // Перемещаем пользователя к истории
        document.getElementById("storyBox").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

});


/* ==================================
   СВЕТ ОТ КУРСОРА
================================== */

const cursorLight = document.querySelector(".cursor-light");

document.addEventListener("mousemove", (event) => {

    cursorLight.style.left = event.clientX + "px";
    cursorLight.style.top = event.clientY + "px";

});


/* ==================================
   АНИМАЦИЯ ПОЯВЛЕНИЯ
================================== */

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.12
});

document.querySelectorAll(
    ".location, .diary-entry, .intro-text, .intro-image"
).forEach(element => {

    observer.observe(element);

});


/* ==================================
   ПЕРВОНАЧАЛЬНАЯ ЗАГРУЗКА
================================== */

updateThemeButton();
updateProgress();
updateDiary();