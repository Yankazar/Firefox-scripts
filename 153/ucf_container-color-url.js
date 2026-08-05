/**
@UCF @param {"prop":"JsBackground","disable":false} @UCF
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
//Строка адреса и выпадающий список в цвет контейнера
(function () {

    function updateColor() {

        const icons = document.getElementById("userContext-icons");
        if (!icons)
            return;

        const color = getComputedStyle(icons)
            .getPropertyValue("--identity-tab-color")
            .trim();

        // Адресная строка
        const input = document.getElementById("urlbar-input");
        if (input)
            input.style.setProperty("color", color, "important");

        // Выпадающий список
document.querySelectorAll(".urlbarView-title, .urlbarView-url")
    .forEach(e => {
        e.style.setProperty("color", color, "important");
    });
    }

    const observer = new MutationObserver(updateColor);

    function init() {

        updateColor();

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        gBrowser.tabContainer.addEventListener("TabSelect", updateColor, true);

        document.getElementById("urlbar")
            ?.addEventListener("ViewOpen", updateColor, true);

        document.getElementById("urlbar")
            ?.addEventListener("input", updateColor, true);
    }

    if (gBrowserInit.delayedStartupFinished)
        init();
    else
        Services.obs.addObserver(function startup(subject, topic) {
            if (topic != "browser-delayed-startup-finished" || subject != window)
                return;
            Services.obs.removeObserver(startup, topic);
            init();
        }, "browser-delayed-startup-finished");

})();