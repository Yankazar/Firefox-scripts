/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
(function() {

    // ============================================================
    // Save Active Tab as PDF
    // ============================================================

    const widgetId = "save-active-tab-pdf-button";

    // ------------------------------------------------------------
    // Удаляем старую регистрацию при повторной загрузке
    // ------------------------------------------------------------

    if (CustomizableUI.getWidget(widgetId)) {
        try {
            CustomizableUI.destroyWidget(widgetId);
        } catch (e) {
            console.error("Save PDF: destroyWidget failed:", e);
        }
    }

    // ------------------------------------------------------------
    // Иконка
    // ------------------------------------------------------------

    const iconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="18" height="18"
             viewBox="0 0 24 24">

            <rect x="3" y="3"
                  width="18" height="18"
                  rx="1.5"
                  fill="white"
                  stroke="#8B0000"
                  stroke-width="1.5"/>

            <text x="12" y="14.2"
                  text-anchor="middle"
                  font-family="Arial, sans-serif"
                  font-size="5.8"
                  font-weight="bold"
                  fill="#8B0000">PDF</text>

        </svg>
    `;

    const iconURL =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(iconSVG);

    // ------------------------------------------------------------
    // Сохранение страницы
    // ------------------------------------------------------------

    async function saveActiveTabAsPDF() {

        try {

            // ----------------------------------------------------
            // 1. Активная вкладка
            // ----------------------------------------------------

            const browser = gBrowser.selectedBrowser;
            const bc = browser.browsingContext;

            if (!bc) {
                console.error("Save PDF: no browsingContext");
                return;
            }

            // ----------------------------------------------------
            // 2. Print Settings Service
            // ----------------------------------------------------

            const PSSVC =
                Cc["@mozilla.org/gfx/printsettings-service;1"]
                    .getService(Ci.nsIPrintSettingsService);

            const ps =
                PSSVC.createNewPrintSettings();

            ps.printerName =
                PrintUtils.SAVE_TO_PDF_PRINTER;

            ps.outputFormat =
                Ci.nsIPrintSettings.kOutputFormatPDF;

            ps.outputDestination =
                Ci.nsIPrintSettings.kOutputDestinationFile;

            // ----------------------------------------------------
            // 3. Загружаем сохранённые настройки PDF
            // ----------------------------------------------------

            const flags =
                ps.kInitSaveAll ^
                ps.kInitSavePrintToFile;

            PSSVC.initPrintSettingsFromPrefs(
                ps,
                true,
                flags
            );

            ps.isInitializedFromPrinter = true;

            // ----------------------------------------------------
            // 4. Папка Downloads Firefox
            // ----------------------------------------------------

            const Downloads =
                ChromeUtils.importESModule(
                    "resource://gre/modules/Downloads.sys.mjs"
                ).Downloads;

            const downloadDir =
                await Downloads.getPreferredDownloadsDirectory();

            // ----------------------------------------------------
            // 5. Имя файла из заголовка страницы
            // ----------------------------------------------------

            let title =
                browser.contentTitle ||
                "Mozilla Firefox";

            title = title
                .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
                .replace(/[. ]+$/g, "")
                .trim();

            if (!title) {
                title = "Mozilla Firefox";
            }

            // ----------------------------------------------------
            // 6. Не перезаписываем существующий файл
            // ----------------------------------------------------

            let fileName =
                title + ".pdf";

            let filePath =
                PathUtils.join(
                    downloadDir,
                    fileName
                );

            let number = 2;

            while (
                await IOUtils.exists(filePath)
            ) {

                fileName =
                    title + " (" + number + ").pdf";

                filePath =
                    PathUtils.join(
                        downloadDir,
                        fileName
                    );

                number++;
            }

            // ----------------------------------------------------
            // 7. Назначаем конечный файл
            // ----------------------------------------------------

            ps.toFileName = filePath;

            console.log(
                "Save PDF:",
                filePath
            );

            // ----------------------------------------------------
            // 8. Печатаем без диалога
            // ----------------------------------------------------

            await bc.print(ps);

            console.log(
                "Save PDF: PRINT FINISHED"
            );

        } catch (e) {

            console.error(
                "Save PDF ERROR:",
                e
            );
        }
    }

    // ------------------------------------------------------------
    // Регистрация кнопки
    // ------------------------------------------------------------

    CustomizableUI.createWidget({

        id: widgetId,

        type: "button",

        defaultArea:
            CustomizableUI.AREA_NAVBAR,

        label:
            "Сохранить страницу в PDF",

        tooltiptext:
            "Сохранить активную страницу в PDF",

        onCommand:
            saveActiveTabAsPDF,

        onCreated:
            function(button) {

                button.style.listStyleImage =
                    `url("${iconURL}")`;

                button.setAttribute(
                    "context",
                    "toolbar-context-menu"
                );

                return button;
            }
    });

})();