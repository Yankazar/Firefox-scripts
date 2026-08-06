# Firefox-scripts
Firefox scripts for custom loaders

Описание/Description
<br>
Здесь лежат кастомные скрипты для Firefox 153, сделанные мной с помощью ЧатГПТ.

1. Кнопки из Custom Buttons, адаптированные для UCF:
<details>
<summary><b>ucf_Hidechrometoggle.js - Постоянно выключенный Chrome-заголовок</b></summary>
Включает-выключает рамку вокруг окна браузера и скрывает управляющие кнопки. <a href="https://web.archive.org/web/20100710024523/http://forum.mozilla-russia.org/viewtopic.php?pid=416246#p416246">Исходный код</a>.
</details>
<details>
<summary><b>ucf_Clock.js - Часы</b></summary>
Кнопка, показывающая системное время. Имеет свой css. <a href="https://forum.mozilla-russia.org/viewtopic.php?pid=724808#p724808">Исходный код</a>.
</details>
<details>
<summary><b>ucf_CaseChange.js - Смена регистра</b></summary>
Смена регистра с заглавных на строчные и наоборот. 
</details>
<details>
<summary><b>ucf_KeyboardLayoutStatus.js - Отображение активного языка</b></summary>
Значок, отображающий активный язык. Всего два варианта, EN и RU. 
</details>
<details>
<summary><b>ucf_Notepad.js - Блокнот в браузере</b></summary>
Открывает по клику встроенный в браузер блокнот с последним выделенным текстом.
</details>
<details>
<summary><b>ucf_ReloadCopy.js - Перезагрузка-копирование</b></summary>
Значок в адресной строке, левый клик - обновить, правый - скопировать текущий адрес.
</details>
<details>
<summary><b>ucf_Zoom.js - Масштаб</b></summary>
Кнопка масштаба, левый клик - увеличить, правый - уменьшить, средний - сбросить значение.
</details>
<details>
<summary><b>ucf_Library.js - Библиотека</b></summary>
Кнопка открывает по клику библиотеку во вкладке.
</details>
<details>
<summary><b>ucf_Single.js - Сохранить с помощью SingleHTMLButton</b></summary>
Кнопка для запуска скрипта от VicDobrov <a href="https://github.com/VicDobrov/UserChromeFiles/blob/main/profile_ucf_dobrov/chrome/user_chrome_files/custom_scripts/ucb_SaveHTML.mjs">ucb_SaveHTML.mjs</a>.  
</details>
<details>
<summary><b>ucf_GoogleTranslate.js - Перевод с помощью GoogleTranslate</b></summary>
Перевод в контекстном меню с помощью GoogleTranslate. Языки: EN и RU.
</details>
<details>
<summary><b>ucf_OpenBookmarksNoCloseMenu.js - Открытие закладок при незакрывающемся меню</b></summary>
С этим скриптом меню закладок не закрывается после клика по закладке, пока с него не уйдёт курсор. Кнопки у скрипта нет (не требуется).
</details>
<br>
2. Скрипты для UCF, адаптированные под FF 153:
<details>
<summary><b>ucf_Browser-Console.js - Кнопка консоли браузера</b></summary>
Кнопка консоли браузера на панели. Запоминает размер, положение. Когда консоль открыта, кнопка подсвечена. Закрывается по той же кнопке.
</details>
<details>
<summary><b>ucf_privateTabs153+.js - Приватная вкладка</b></summary>
Создаёт приватную вкладку в браузере. <a href="https://github.com/aminomancer/uc.css.js/blob/master/JS/privateTabs.uc.js">Исходный код</a>.
</details>
<details>
<summary><b>ucf_aboutaddons.js - Дополнительные пункты контекстного меню на странице about:addons</b></summary>
Добавляет дополнительные пункты контекстного меню на странице about:addons и делает его компактным. Функция обновления аддонов по отдельности не работает, убирать кнопку не стал, если кто-то желает, может попытаться допилить. <a href="https://forum.mozilla-russia.org/viewtopic.php?pid=804854#p804854">Исходный код</a>.
<img src="https://raw.githubusercontent.com/Yankazar/Firefox-scripts/refs/heads/main/Firefox-scripts4.png" height="320" alt="Firefox-scripts4">  

</details>

<br>

3. Новые скрипты для UCF под FF 153:
<details>
<summary><b>ucf_Browser-Toolbox.js - Кнопка Browser Toolbox</b></summary>
Кнопка Browser Toolbox на панели. Кнопка подсвечена, пока Toolbox открыт. Закрытие по кнопке сделать невозможно, закрывать кликом по крестику.
</details>
<details>
<summary><b>ucf_container-color-url.js - Текст адресной панели в цвет контейнера</b></summary>
Меняет цвет цвет текста в адресной панели и выпадающего списка адресной панели в зависимости от цвета иконки контейнера, сделал из-за <a href="https://forum.ru-board.com/topic.cgi?forum=5&topic=51720&start=500#15">этого запроса</a>. рекомендуется использовать со стилем рамки из того же сообщения.
</details>
<details>
<summary><b>ucf_DownloadCounter.js - Счётчик загрузок</b></summary>
Отображает количество активных и завершённых загрузок до перезагрузки браузера.
<img src="https://raw.githubusercontent.com/Yankazar/Firefox-scripts/refs/heads/main/Firefox-scripts3.png" height="320" alt="Firefox-scripts3">  

</details>

<details>
<summary><b>Скрины окна браузера с иконками кнопок</b></summary>
<img src="https://raw.githubusercontent.com/Yankazar/Firefox-scripts/refs/heads/main/Firefox-scripts1.png" height="320" alt="Firefox-scripts1">
<img src="https://raw.githubusercontent.com/Yankazar/Firefox-scripts/refs/heads/main/Firefox-scripts2.png" height="320" alt="Firefox-scripts2">  
</details>
