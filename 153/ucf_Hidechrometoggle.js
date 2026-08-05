/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
// ==UserScript==
// @name           HideChrome Toggle
// @include        main
// ==/UserScript==
console.log("window =", window.location.href);
console.log("location =", location.href);
console.log("gBrowserInit =", typeof gBrowserInit);
console.log("CustomizableUI =", typeof CustomizableUI);
(function () {
    if (location.href !== "chrome://browser/content/browser.xhtml")
        return;

    const ICON_ON =
        "chrome://browser/skin/fullscreen.svg";

    const ICON_OFF =
        "chrome://browser/skin/window.svg";

    function refreshWindow() {
        requestAnimationFrame(() => {
            window.restore();
            requestAnimationFrame(() => {
                window.maximize();
                requestAnimationFrame(() => {
                    window.restore();
                });
            });
        });
    }

    function updateButton(button) {

    if (!button)
        button = document.getElementById("hidechrome-toggle");

    if (!button)
        return;

    const enabled =
        document.getElementById("main-window").getAttribute("hidechrome") === "true";

    button.style.listStyleImage =
        `url("${enabled ? ICON_OFF : ICON_ON}")`;

    button.setAttribute(
        "tooltiptext",
        enabled
            ? "Показать системную рамку"
            : "Скрыть системную рамку"
    );
}

    function toggle() {

    const mainWindow = document.getElementById("main-window");

    const enabled =
        mainWindow.getAttribute("hidechrome") === "true";

    mainWindow.setAttribute(
        "hidechrome",
        enabled ? "false" : "true"
    );

    refreshWindow();

    updateButton();
}

    function createButton() {

    if (CustomizableUI.getPlacementOfWidget("hidechrome-toggle"))
        return;

    CustomizableUI.createWidget({
        id: "hidechrome-toggle",
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

        if (!mainWindow.hasAttribute("hidechrome"))
            mainWindow.setAttribute("hidechrome", "true");

        refreshWindow();

        createButton();
    }

    if (gBrowserInit.delayedStartupFinished) {
        init();
    } else {
        const observer = (subject, topic) => {
            if (subject !== window)
                return;

            Services.obs.removeObserver(observer, topic);
            init();
        };

        Services.obs.addObserver(
            observer,
            "browser-delayed-startup-finished"
        );
    }

})();

// При горячей перезагрузке .uc.js кнопка будет корректно удаляться
window.addEventListener("unload", () => {
    CustomizableUI.destroyWidget("hidechrome-toggle");
}, { once: true });


const css = `
#hidechrome-toggle {
    transition: opacity .15s ease;
}
`;

const uri = Services.io.newURI(
    "data:text/css;charset=utf-8," + encodeURIComponent(css)
);

const sss = Cc["@mozilla.org/content/style-sheet-service;1"]
    .getService(Ci.nsIStyleSheetService);

sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);