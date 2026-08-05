/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
// ==UserScript==
// @name           clockToolbarWidget
// @include        main
// ==/UserScript==
(function() {

    const { CustomizableUI } = window;

    let widgetId = "clockToolbarWidget";


    CustomizableUI.createWidget({

        id: widgetId,

        type: "custom",

        defaultArea: CustomizableUI.AREA_NAVBAR,

        label: "Часы",

        tooltiptext: "Часы",


        onBuild: function(doc) {

            let item = doc.createXULElement("toolbaritem");

            item.id = widgetId;

            item.setAttribute(
                "class",
                "chromeclass-toolbar-additional"
            );


            let label = doc.createXULElement("label");

            label.id = widgetId + "-label";

            label.value = "00:00";


            item.appendChild(label);


            // CSS
            let css = `
            #${widgetId} {
  /*              padding: 0 6px;*/
                align-items: center;
            }

            #${widgetId}-label {
     transform: translateY(-2px) !important; 
				 color: rgba(30, 107, 79, 0.6) !important;
   font-weight: bold !important;
   display: block !important;
   font-family: verdana !important;
   font-size: 19px !important;
   text-shadow: white 0 0 3px, white 0 0 3px, white 0 0 3px, white 0 0 3px, rgba(255, 255, 255, .5) 0 1px 0 !important;
                font-family: monospace;
                font-size: 14px;
                font-weight: bold;
            }

			
            `;


            let uri =
                Services.io.newURI(
                    "data:text/css;charset=utf-8," +
                    encodeURIComponent(css)
                );


            let sss =
                Cc["@mozilla.org/content/style-sheet-service;1"]
                .getService(Ci.nsIStyleSheetService);


            if (!sss.sheetRegistered(uri, sss.USER_SHEET))
                sss.loadAndRegisterSheet(
                    uri,
                    sss.USER_SHEET
                );


            function updateClock() {

                label.value =
                    new Date()
                    .toLocaleTimeString("lv-LV")
                    .slice(0,5);

            }


            updateClock();

            let timer =
                setInterval(updateClock, 1000);


            item.addEventListener(
                "mouseover",
                function() {

                    let date = new Date();

                    item.setAttribute(
                        "tooltiptext",
                        date.toLocaleDateString() +
                        ". " +
                        date.toLocaleDateString(
                            "ru",
                            {weekday:"long"}
                        )
                    );

                }
            );


            // чтобы таймер не оставался после удаления виджета
            item._clockTimer = timer;


            return item;
        }

    });


})();