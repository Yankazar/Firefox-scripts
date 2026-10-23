/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
// ==UserScript==
// @name           HideChrome Toggle
// @include        main
// ==/UserScript==

(function () {
    if (location.href !== "chrome://browser/content/browser.xhtml")
        return;

    const BUTTON_ID = "hidechrome-toggle";
    const ATTR = "hidechrome";

    const ICON_ON = "chrome://browser/skin/fullscreen.svg";
    const ICON_OFF = "chrome://browser/skin/window.svg";

    // Win32 constants
    const GWL_STYLE = -16;
    const GWL_EXSTYLE = -20;

    const WS_BORDER = 0x00800000;
    const WS_THICKFRAME = 0x00040000;
    const WS_EX_WINDOWEDGE = 0x00000100;

    const SWP_NOSIZE = 0x0001;
    const SWP_NOMOVE = 0x0002;
    const SWP_NOZORDER = 0x0004;
    const SWP_NOACTIVATE = 0x0010;
    const SWP_FRAMECHANGED = 0x0020;

    const FRAME_FLAGS =
        SWP_NOSIZE | SWP_NOMOVE | SWP_NOZORDER |
        SWP_NOACTIVATE | SWP_FRAMECHANGED;

    let win32 = null;

    function initWin32() {
        if (win32) return win32;

        const { ctypes } = ChromeUtils.importESModule(
            "resource://gre/modules/ctypes.sys.mjs"
        );

        const lib = ctypes.open("user32.dll");

        try {
            win32 = {
                ctypes,
                lib,

                GetForegroundWindow: lib.declare(
                    "GetForegroundWindow",
                    ctypes.winapi_abi,
                    ctypes.intptr_t
                ),

                GetWindowLongW: lib.declare(
                    "GetWindowLongW",
                    ctypes.winapi_abi,
                    ctypes.int32_t,
                    ctypes.intptr_t,
                    ctypes.int32_t
                ),

                SetWindowLongW: lib.declare(
                    "SetWindowLongW",
                    ctypes.winapi_abi,
                    ctypes.int32_t,
                    ctypes.intptr_t,
                    ctypes.int32_t,
                    ctypes.int32_t
                ),

                SetWindowPos: lib.declare(
                    "SetWindowPos",
                    ctypes.winapi_abi,
                    ctypes.int32_t,
                    ctypes.intptr_t,
                    ctypes.intptr_t,
                    ctypes.int32_t,
                    ctypes.int32_t,
                    ctypes.int32_t,
                    ctypes.int32_t,
                    ctypes.uint32_t
                )
            };
        } catch (e) {
            lib.close();
            throw e;
        }

        return win32;
    }

    function restoreFrame() {
        try {
            const api = initWin32();
            const hwnd = api.GetForegroundWindow();

            if (!hwnd) {
                console.error("[HideChrome] Не удалось получить HWND.");
                return;
            }

            let style = api.GetWindowLongW(hwnd, GWL_STYLE);
            let exstyle = api.GetWindowLongW(hwnd, GWL_EXSTYLE);

            style = (style | WS_BORDER | WS_THICKFRAME) | 0;
            exstyle = (exstyle | WS_EX_WINDOWEDGE) | 0;

            api.SetWindowLongW(hwnd, GWL_STYLE, style);
            api.SetWindowLongW(hwnd, GWL_EXSTYLE, exstyle);

            const ok = api.SetWindowPos(
                hwnd,
                api.ctypes.intptr_t(0),
                0, 0, 0, 0,
                FRAME_FLAGS
            );

            if (!ok) {
                console.error(
                    "[HideChrome] SetWindowPos завершился ошибкой."
                );
            }
        } catch (e) {
            console.error("[HideChrome] Ошибка восстановления рамки:", e);
        }
    }

    function updateButton(button) {
        if (!button)
            button = document.getElementById(BUTTON_ID);
        if (!button) return;

        const enabled =
            document.getElementById("main-window")
                .getAttribute(ATTR) === "true";

        button.style.listStyleImage =
            `url("${enabled ? ICON_OFF : ICON_ON}")`;

        button.setAttribute(
            "tooltiptext",
            enabled
                ? "Показать системные кнопки окна"
                : "Скрыть системные кнопки окна"
        );
    }

    function scheduleFrameRestore() {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                restoreFrame();
                updateButton();
            });
        });
    }

    function toggle() {
        const mainWindow = document.getElementById("main-window");

        const enabled = mainWindow.getAttribute(ATTR) === "true";

        mainWindow.setAttribute(
            ATTR,
            enabled ? "false" : "true"
        );

        scheduleFrameRestore();
    }

    function createButton() {
        const widget = CustomizableUI.getWidget(BUTTON_ID);
        if (widget && widget.areaType) return;

        CustomizableUI.createWidget({
            id: BUTTON_ID,
            type: "button",
            defaultArea: CustomizableUI.AREA_NAVBAR,
            label: "HideChrome",
            tooltiptext: "HideChrome",
            onCreated(button) {
                button.addEventListener("command", toggle);
                updateButton(button);
                return button;
            }
        });
    }

    function init() {
        const mainWindow = document.getElementById("main-window");

        if (!mainWindow.hasAttribute(ATTR))
            mainWindow.setAttribute(ATTR, "true");

        createButton();
        updateButton();

        // Восстановить рамку и при старте, если HideChrome включён.
        if (mainWindow.getAttribute(ATTR) === "true")
            scheduleFrameRestore();
    }

    if (gBrowserInit.delayedStartupFinished) {
        init();
    } else {
        const observer = (subject, topic) => {
            if (subject !== window) return;
            Services.obs.removeObserver(observer, topic);
            init();
        };

        Services.obs.addObserver(
            observer,
            "browser-delayed-startup-finished"
        );
    }

    window.addEventListener("unload", () => {
        CustomizableUI.destroyWidget(BUTTON_ID);

        if (win32) {
            try {
                win32.lib.close();
            } catch (e) {}
            win32 = null;
        }
    }, { once: true });
})();
