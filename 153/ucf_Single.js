/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
// ==UserScript==
// @name           SingleHTML
// @include        main
// ==/UserScript==
(function() {

    let widgetId = "SingleHTMLButton";


    if (CustomizableUI.getWidget(widgetId)) {
        CustomizableUI.destroyWidget(widgetId);
    }


    CustomizableUI.createWidget({

        id: widgetId,

        type: "button",

        defaultArea: CustomizableUI.AREA_NAVBAR,

        label: "HTML",

        tooltiptext:
            "Открыть Single HTML",


        onCreated: function(button) {


            // Иконка (временно стандартная)
            button.style.listStyleImage =
                'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACrklEQVRYhc2UIXDiQBSGIxAnIxAnIhARiAoEoqICgUBUVCAqTlRUVCAiTkQgEBURFRWIiIqIFRGIFQhEBCICUYFYERmxAhFxYgXuP8HsIwkL7dxR7nbmm2E2O/zfe5s8636yxL/Cak9g3U+WuLmNcHMb4TESOPdSShGy2KL9sKC8/09gGJoFpquC0CvNVWXfhCy2FCyLLYRUpwXuXjKjQD/OibJUed/EPFMUrHGGc9zcRuj0wr1Apxei0wuPCnTeMkIvti5wz/MK/TivnE1zVQlP852AziMBtzuF252i/7I2CrReBXFsCanQecvonL4CHZzmCvNMwR5wyiMBxw3guAH643fjn9vP78Sx8NaroDP18Hm2I15vYQ84HDeA3Qr2AnZrt3HtrYwB3/wVYQq3n9/p+XRVVFqugzX2gFMeCTSaYzSa46MCjacFUQ9vjhJ6Vg9P82o4WxewriPKOxC4Gi0/LVAOb44SBIk8CNfVs3UBtt59micF2g8Lo4D1Y0boZT9w2muOElyNlwc8zSQFa/5IoNFnBLCbbuW9YwxDUQl/Tn6dFnCGc6OAH2eEHquPkTAyDPd4fEPBmg8FlFJGifpINd21vu961RqPb04L6GEki+1Zwz2+gcc3sL01rO/BiQ64Aez2K+wBR6PPYF1H56UUbhTQA6J86Cs5ELg0nxbo9nzMOCfimIMxhjCKjMTx7tx0GsJx/b8X+DkOdy+ilEjTFGmaYpEkmHFOvxdJQs+klJBSQimFbu+MAjPO4bg+MbjzKVwLCCG+RkBKiRnnB1dTr74sAODyAuXqLy5Qr/7sVxDHZoF6+3X1UsrLCtTbf1EBU/vPLsAYOxA4VX2apucTEEJgxjk8/6WC6dvXAosk+VjAsqwPJR5HAVVqmnym9gshwBj7nICWsNqTi/MbHc5Qj2b9XgcAAAAASUVORK5CYII=")';



            button.addEventListener(
                "command",
                function() {

                    try {

                        Cu.getGlobalForObject(Cu)
                        [Symbol.for("UcfAPI")]
                        .SingleHTML(1);

                    }
                    catch(e) {

                        console.error(
                            "SingleHTML error:",
                            e
                        );

                    }

                }
            );


        }

    });


})();