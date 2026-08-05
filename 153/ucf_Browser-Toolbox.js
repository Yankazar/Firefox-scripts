/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/

try {

const { BrowserToolboxLauncher } =
    ChromeUtils.importESModule(
        "resource://devtools/client/framework/browser-toolbox/Launcher.sys.mjs"
    );

let launcher = null;
let button = null;
let timer = null;

CustomizableUI.createWidget({

    id: "ucf-browser-toolbox",

    label: "Browser Toolbox",

    localized: false,

    tooltiptext: "Browser Toolbox",

    onCreated(btn) {

        button = btn;

btn.setAttribute("style", "-moz-context-properties: fill, fill-opacity;");

btn.style.listStyleImage =
    `url("data:image/svg+xml,${encodeURIComponent(`
<!-- Browser Toolbox - inspector variant -->
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="#5f6368">
  <path d="M0 4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V4zm3-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3z"/>

  <!-- command prompt -->
  <path d="M4.25 5.2a.62.62 0 0 1 .88.02l2.45 2.55c.23.24.23.62 0 .86l-2.45 2.55a.63.63 0 0 1-.9-.86L6.25 8.2 4.2 6.08a.62.62 0 0 1 .05-.88z"/>

  <!-- inspector cross -->
  <path d="M10.75 5.25a.5.5 0 0 1 .5.5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 .5-.5z"/>

  <circle cx="10.75" cy="7.25" r=".75"/>
</svg>
`)}")`;

        btn.setAttribute("type", "checkbox");

        btn.addEventListener("command", async () => {

            try {

                launcher = BrowserToolboxLauncher.init();

                if (!launcher) {
                    return;
                }

                btn.setAttribute("checked", "true");

if (timer) {
    clearInterval(timer);
}

timer = setInterval(() => {

    if (!BrowserToolboxLauncher.getBrowserToolboxSessionState()) {

        clearInterval(timer);
        timer = null;

        launcher = null;

        if (button) {
            button.removeAttribute("checked");
        }

    }

}, 1000);

            }

            catch (ex) {

                launcher = null;

                if (button) {
                    button.removeAttribute("checked");
                }

                Cu.reportError(ex);

            }

        });

    }

});

}

catch (ex) {

    Cu.reportError(ex);

}