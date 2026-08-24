
Skip to content

    Yankazar
    Firefox-scripts

Repository navigation

Code
Issues
Pull requests
Actions
Projects
Wiki
Security and quality
Insights

    Settings

Files
tT

153

README.md
ucf_Browser-Console.js
ucf_Browser-Toolbox.js
ucf_CaseChange.js
ucf_Clock.js
ucf_DownloadCounter.js
ucf_GoogleTranslate.js
ucf_Hidechrometoggle.js
ucf_KeyboardLayoutStatus.js
ucf_Library.js
ucf_Notepad.js
ucf_OpenBookmarksNoCloseMenu.js
ucf_ReloadCopy.js

    Firefox-scripts/153

/ucf_Library.js
Yankazar
Yankazar
Add files via upload
48fbc4c
 · 
Aug 5, 2026

57 lines (34 loc) · 1.22 KB
/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
// ==UserScript==
// @name           Library
// @include        main
// ==/UserScript==

(function() {

    let widgetId = "openPlacesLibraryButton";


    // Удаляем старую повреждённую регистрацию при повторной загрузке
    if (CustomizableUI.getWidget(widgetId)) {
        CustomizableUI.destroyWidget(widgetId);
    }


    CustomizableUI.createWidget({

        id: widgetId,

        type: "button",

        defaultArea: CustomizableUI.AREA_NAVBAR,

        label: "Библиотека",

        tooltiptext: "Открыть библиотеку закладок",


        onCreated: function(button) {

            button.style.listStyleImage =
                'url("chrome://browser/skin/library.svg")';


            button.addEventListener(
                "command",
                function() {

                    let tab = gBrowser.addTrustedTab(
                        "chrome://browser/content/places/places.xhtml"
                    );

                    gBrowser.selectedTab = tab;

                }
            );

        }

    });


})();
 
