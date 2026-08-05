/**
@UCF @param {"prop":"JsChrome.load"} @UCF
*/
// ==UserScript==
// @name           KeyboardLayoutStatus.uc.js
// @description    Показывает предполагаемую раскладку клавиатуры (EN/RU)
// @include        main
// ==/UserScript==

(function () {

    const widgetId = "layout-status-button";

    // Если скрипт уже загружен — удаляем старый виджет
    if (CustomizableUI.getWidget(widgetId)) {
        try {
            CustomizableUI.destroyWidget(widgetId);
        } catch (e) {}
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

    function updateButton(layout) {

        currentLayout = layout;

        let button = document.getElementById(widgetId);

        if (!button)
            return;

        button.tooltipText = "Текущая раскладка: " + layout;

        button.style.setProperty(
            "-moz-context-properties",
            "fill"
        );

        button.style.listStyleImage =
            `url("${layout === "EN" ? ICON_EN : ICON_RU}")`;
    }

    function detectLayout(key) {

        if (!key || key.length !== 1)
            return;

        let code = key.charCodeAt(0);

        // Русская раскладка
        if (
            key === "ё" ||
            key === "Ё" ||
            (code >= 0x0400 && code <= 0x04FF)
        ) {

            if (currentLayout !== "RU")
                updateButton("RU");

            return;
        }

        // Английская раскладка
        if (
            (code >= 65 && code <= 90) ||
            (code >= 97 && code <= 122)
        ) {

            if (currentLayout !== "EN")
                updateButton("EN");
        }
    }

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

            button.style.listStyleImage =
                `url("${ICON_EN}")`;

            button.addEventListener(
                "command",
                function () {

                    updateButton(
                        currentLayout === "EN"
                            ? "RU"
                            : "EN"
                    );

                }
            );

            return button;
        }

    });

    window.addEventListener(
        "keydown",
        function (event) {

            detectLayout(event.key);

        },
        true
    );

})();