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