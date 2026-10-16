/**
@UCF @param {"prop":"JsChrome.load"} @UCF
*/
// ==UserScript==
// @name           KeyboardLayoutStatus.uc.js
// @description    Показывает текущую раскладку Windows (EN/RU)
// @include        main
// ==/UserScript==

(function () {
    "use strict";

    const widgetId = "layout-status-button";

    // Если скрипт уже загружен — удаляем старый виджет.
    if (CustomizableUI.getWidget(widgetId)) {
        try {
            CustomizableUI.destroyWidget(widgetId);
        } catch (e) {}
    }

    // Windows API: получаем раскладку потока активного окна.
    let ctypes = null;
    let user32 = null;
    let GetForegroundWindow = null;
    let GetWindowThreadProcessId = null;
    let GetKeyboardLayout = null;

    try {
        ({ ctypes } = ChromeUtils.importESModule(
            "resource://gre/modules/ctypes.sys.mjs"
        ));

        user32 = ctypes.open("user32.dll");

        GetForegroundWindow = user32.declare(
            "GetForegroundWindow",
            ctypes.winapi_abi,
            ctypes.intptr_t
        );

        GetWindowThreadProcessId = user32.declare(
            "GetWindowThreadProcessId",
            ctypes.winapi_abi,
            ctypes.uint32_t,
            ctypes.intptr_t,
            ctypes.uint32_t.ptr
        );

        GetKeyboardLayout = user32.declare(
            "GetKeyboardLayout",
            ctypes.winapi_abi,
            ctypes.uintptr_t,
            ctypes.uint32_t
        );
    } catch (e) {
        console.error(
            "[KeyboardLayoutStatus] Ошибка подключения user32.dll:",
            e
        );
    }

    function makeSVG(text) {
        return "data:image/svg+xml," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg"
     width="16"
     height="16"
     viewBox="0 0 16 16">
<text x="8"
      y="12"
      font-family="Segoe UI,Arial,sans-serif"
      font-size="13"
      font-weight="700"
      text-anchor="middle"
      fill="#5f6368">${text}</text>
</svg>`);
    }

    const ICON_EN = makeSVG("EN");
    const ICON_RU = makeSVG("RU");

    let currentLayout = "EN";
    let checkScheduled = false;

    function updateButton(layout) {
        if (layout !== "EN" && layout !== "RU")
            return;

        currentLayout = layout;

        const button = document.getElementById(widgetId);

        if (!button)
            return;

        button.setAttribute(
            "tooltiptext",
            "Текущая раскладка: " + layout
        );

        button.style.setProperty(
            "-moz-context-properties",
            "fill"
        );

        button.style.listStyleImage =
            `url("${layout === "EN" ? ICON_EN : ICON_RU}")`;
    }

    function getWindowsLayout() {
        if (
            !GetForegroundWindow ||
            !GetWindowThreadProcessId ||
            !GetKeyboardLayout
        ) {
            return null;
        }

        try {
            const hwnd = GetForegroundWindow();

            if (hwnd.toString() === "0")
                return null;

            const pid = ctypesUint32(0);
            const threadId = GetWindowThreadProcessId(
                hwnd,
                pid.address()
            );

            if (!threadId)
                return null;

            const hkl = GetKeyboardLayout(threadId);
            const langId = Number(hkl.toString()) & 0xFFFF;

            if (langId === 0x0409)
                return "EN";

            if (langId === 0x0419)
                return "RU";

            return null;
        } catch (e) {
            console.error(
                "[KeyboardLayoutStatus] Ошибка чтения раскладки:",
                e
            );

            return null;
        }
    }

    // Тип ctypes.uint32_t нужен для получения PID окна.
    function ctypesUint32(value) {
        return ctypes.uint32_t(value);
    }

    function refreshLayout() {
        const layout = getWindowsLayout();

        if (layout)
            updateButton(layout);
    }

    // Повторная проверка после обработки системного переключения.
    function scheduleRefresh() {
        if (checkScheduled)
            return;

        checkScheduled = true;

        window.setTimeout(function () {
            checkScheduled = false;
            refreshLayout();
        }, 0);
    }

    function isTextField(target) {
        if (!target)
            return false;

        if (target instanceof HTMLInputElement) {
            return ![
                "button",
                "submit",
                "reset",
                "checkbox",
                "radio",
                "range",
                "color",
                "file",
                "image"
            ].includes(target.type);
        }

        if (target instanceof HTMLTextAreaElement)
            return true;

        if (target.isContentEditable)
            return true;

        return false;
    }

    // Создаём кнопку панели.
    CustomizableUI.createWidget({
        id: widgetId,
        type: "button",
        defaultArea: CustomizableUI.AREA_NAVBAR,
        label: "Раскладка",
        tooltiptext: "Текущая раскладка: EN",

        onCreated(button) {
            button.style.setProperty(
                "-moz-context-properties",
                "fill"
            );

            button.style.listStyleImage = `url("${ICON_EN}")`;

            // Кнопка обновляет отображение реальной раскладки.
            button.addEventListener("command", function () {
                refreshLayout();
            });

            return button;
        }
    });

    // Клик или переход фокуса в поле ввода.
    window.addEventListener(
        "focusin",
        function (event) {
            if (isTextField(event.target))
                refreshLayout();
        },
        true
    );

    // Дополнительная проверка при клике, в том числе
    // когда фокус уже находился в том же поле.
    window.addEventListener(
        "mousedown",
        function (event) {
            if (isTextField(event.target))
                refreshLayout();
        },
        true
    );

    // Alt+Shift: повторно читаем раскладку после переключения.
    window.addEventListener(
        "keydown",
        function (event) {
            if (
                event.key === "Alt" ||
                event.key === "Shift"
            ) {

                return;
            }

            // Запасной вариант: уточняем раскладку по символу.
            const key = event.key;

            if (!key || key.length !== 1)
                return;

            const code = key.charCodeAt(0);

            if (
                key === "ё" ||
                key === "Ё" ||
                (code >= 0x0400 && code <= 0x04FF)
            ) {
                updateButton("RU");
            } else if (
                (code >= 65 && code <= 90) ||
                (code >= 97 && code <= 122)
            ) {
                updateButton("EN");
            }

            scheduleRefresh();
        },
        true
    );

    // Отслеживаем фокус в текстовых полях веб-страниц.
    const frameCode = `
        if (!this.__KeyboardLayoutStatusListeners) {
            this.__KeyboardLayoutStatusListeners = true;

            function isTextField(el) {
                if (!el)
                    return false;

                const tag = (el.localName || "").toLowerCase();

                if (tag === "textarea")
                    return true;

                if (tag === "input") {
                    return /^(text|search|url|tel|password|email)$/i.test(
                        el.type
                    );
                }

                return !!(
                    el.isContentEditable ||
                    (el.closest && el.closest("[contenteditable='true']"))
                );
            }

            function notifyFocus(event) {
                if (isTextField(event.target)) {
                    sendAsyncMessage(
                        "KeyboardLayoutStatus:ContentFocus",
                        {}
                    );
                }
            }

            addEventListener("focusin", notifyFocus, true);
            addEventListener("mousedown", notifyFocus, true);
        }
    `;

    const frameURL =
        "data:application/javascript;charset=utf-8," +
        encodeURIComponent(frameCode);

    function onContentFocus() {
        refreshLayout();
    }

    Services.mm.removeMessageListener(
        "KeyboardLayoutStatus:ContentFocus",
        onContentFocus
    );

    Services.mm.addMessageListener(
        "KeyboardLayoutStatus:ContentFocus",
        onContentFocus
    );

    Services.mm.loadFrameScript(frameURL, true);

    // Начальное состояние — фактическая раскладка Windows.
    refreshLayout();

})();
