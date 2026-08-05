/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
try {

CustomizableUI.createWidget({

    id: "ucf-browser-console",

    label: "Browser Console",

    localized: false,

    tooltiptext: "Browser Console",

    onCreated(btn) {

        btn.style.listStyleImage =
            'url("chrome://devtools/skin/images/tool-webconsole.svg")';

//
btn.setAttribute("type", "checkbox");

        btn.addEventListener("command", async () => {

            try {

                const Loader =
                    ChromeUtils.importESModule(
                        "resource://devtools/shared/loader/Loader.sys.mjs"
                    );

                const BCM =
                    Loader.require(
                        "devtools/client/webconsole/browser-console-manager"
                    ).BrowserConsoleManager;

// Позиция окна
const PREF = "ucf.browserConsole.";

function saveBounds(win) {

    Services.prefs.setIntPref(PREF + "x", win.screenX);
    Services.prefs.setIntPref(PREF + "y", win.screenY);
    Services.prefs.setIntPref(PREF + "w", win.outerWidth);
    Services.prefs.setIntPref(PREF + "h", win.outerHeight);

}

function restoreBounds(win) {

    try {

        let x = Services.prefs.getIntPref(PREF + "x");
        let y = Services.prefs.getIntPref(PREF + "y");
        let w = Services.prefs.getIntPref(PREF + "w");
        let h = Services.prefs.getIntPref(PREF + "h");

        win.moveTo(x, y);
        win.resizeTo(w, h);

    }

    catch (ex) {}

}

                const hud = BCM.getBrowserConsole();

if (hud) {
    await BCM.closeBrowserConsole();
//
btn.removeAttribute("checked");

} else {
    await BCM.openBrowserConsoleOrFocus();
//
btn.setAttribute("checked", "true");
//
const hud = BCM.getBrowserConsole();

if (hud) {

    const win = hud.chromeWindow;

//
win.addEventListener("unload", () => {

    btn.removeAttribute("checked");

}, { once: true });

    restoreBounds(win);

    win.addEventListener("resize", () => saveBounds(win));

    win.addEventListener("move", () => saveBounds(win));

    win.addEventListener("unload", () => saveBounds(win), {
        once: true
    });

}


}

            }

            catch (ex) {

                Cu.reportError(ex);

            }

        });

    }

});

}

catch (ex) {

    Cu.reportError(ex);

}
