/**
@UCF @param {"prop":"JsChrome.load"} @UCF
*/
// ==UserScript==
// @name            Download Counter Button
// @description     Создает отдельную кнопку со счётчиком активных загрузок
// @author          chatGPT
// @compatibility   Firefox 153+ / xiaoxiaoflood loader
// @version         1.0
// ==/UserScript==

(function() {
  if (window.gDownloadCustomButtonInitialized) return;
  window.gDownloadCustomButtonInitialized = true;

  let Downloads;
  try {
    // Импортируем современный модуль загрузок
    Downloads = ChromeUtils.importESModule("resource://gre/modules/Downloads.sys.mjs").Downloads;
  } catch (e) {
    try {
      Downloads = ChromeUtils.import("resource://gre/modules/Downloads.jsm").Downloads;
    } catch (err) {
      return;
    }
  }

  const BUTTON_ID = "custom-downloads-counter-button";
let completedCount = 0;
  const BUTTON_LABEL = "Загрузки (Счётчик)";

  try {
    var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

    CustomizableUI.createWidget({
      id: BUTTON_ID,
      defaultArea: CustomizableUI.AREA_NAVBAR,
      removable: true,
      label: BUTTON_LABEL,
      tooltiptext: BUTTON_LABEL,
      onClick: function(event) {
        // Открываем панель загрузок по клику (ЛКМ или СКМ)
        if (event.button == '0' || event.button == '1') {
          try {
            if (window.DownloadsPanel) {
              window.DownloadsPanel.showPanel(event);
            } else {
              gBrowser.selectedTab = gBrowser.addTrustedTab('about:downloads');
            }
          } catch (e) {}
        }
      },
      onCreated: function(button) {
        return button;
      }
    });

    // Оформляем иконку и счётчик-badge через AGENT_SHEET
    // Счётчик будет генерироваться прямо из атрибута [badge] с помощью CSS
    var cssText = '\
      #' + BUTTON_ID + ' .toolbarbutton-icon {\
        list-style-image: url("chrome://browser/skin/downloads/downloads.svg");\
		text-shadow: white 0 0 3px, white 0 0 3px, white 0 0 3px, white 0 0 3px, rgba(255, 255, 255, .5) 0 1px 0 !important;\
		bottom: 1px;\
      }\
      #' + BUTTON_ID + ' {\
        position: relative !important;\
      }\
      #' + BUTTON_ID + '[badge]::after {\
        content: attr(badge);\
        position: absolute;\
        bottom: -2px;\
        right: 2px;\
        background-color: var(--download-counter-color, #ff3b30) !important;\
        color: white !important;\
        font-size: 10px !important;\
        font-weight: bold !important;\
        padding: 1px 4px !important;\
        border-radius: 8px !important;\
        line-height: 1 !important;\
        min-width: 10px;\
        text-align: center;\
        pointer-events: none;\
        box-shadow: 0 1px 2px rgba(0,0,0,0.4);\
        z-index: 2;\
      }\
    ';

    var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(cssText), null, null);
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

    // Запускаем отслеживание состояния закачек
    initDownloadListener();

  } catch (e) {
    Components.utils.reportError(e);
  }

  async function initDownloadListener() {
    try {
      let list = await Downloads.getList(Downloads.PUBLIC);
let view = {
  onDownloadAdded(download) {
    updateCounter();
  },

  onDownloadChanged(download) {
    if (download.succeeded && !download._downloadCounterDone) {
      download._downloadCounterDone = true;
      completedCount++;
    }

    updateCounter();
  },

  onDownloadRemoved(download) {
    updateCounter();
  }
};
      await list.addView(view);
      updateCounter(); // Первая проверка при старте
    } catch (e) {
      console.error(e);
    }
  }

async function updateCounter() {
  try {
    let list = await Downloads.getList(Downloads.ALL);
    let downloads = await list.getAll();

let activeCount = downloads.filter(download => !download.stopped).length;

console.log(
  "completed =", completedCount,
  "active =", activeCount,
  "sum =", completedCount + activeCount
);

let value;

if (activeCount > 0) {
  value = completedCount > 0
    ? `${completedCount}+${activeCount}`
    : String(activeCount);
} else {
  value = String(completedCount);
}

    let btn = document.getElementById(BUTTON_ID);

    if (!btn)
      return;

    if (activeCount > 0)
      btn.style.setProperty("--download-counter-color", "#ff3b30");
    else
      btn.style.setProperty("--download-counter-color", "#34c759");

btn.tooltipText =
`Загрузки

Завершено: ${completedCount}
Активных: ${activeCount}`;

if (completedCount > 0 || activeCount > 0)
  btn.setAttribute("badge", value);
else
  btn.removeAttribute("badge");

  } catch (e) {
    console.error(e);
  }
}

})();