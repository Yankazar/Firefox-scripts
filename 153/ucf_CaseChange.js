/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
// ==UserScript==
// @name           ChangeCase
// @include        main
// ==/UserScript==
(function() {

    let widgetId = "ChangeCaseButton";


    // Удаляем старую регистрацию при повторной загрузке
    if (CustomizableUI.getWidget(widgetId)) {
        CustomizableUI.destroyWidget(widgetId);
    }


    let lastFocused = null;


    window.addEventListener("focusin", function(e) {

        if (
            e.target &&
            (e.target.tagName == "textarea" ||
             e.target.tagName == "input")
        ) {
            lastFocused = e.target;
        }

    }, true);



    function replaceCase(type) {

        let box = lastFocused;

        if (!box)
            return;


        let start = box.selectionStart;
        let end = box.selectionEnd;


        if (start == end)
            return;


        let before = box.value.substring(0, start);
        let selected = box.value.substring(start, end);
        let after = box.value.substring(end);


        if (type == "upper")
            selected = selected.toUpperCase();


        if (type == "title")
            selected =
                selected.charAt(0).toUpperCase() +
                selected.slice(1).toLowerCase();


        if (type == "lower")
            selected = selected.toLowerCase();



        box.value =
            before +
            selected +
            after;


        let pos =
            before.length +
            selected.length;


        box.selectionStart = pos;
        box.selectionEnd = pos;

        box.focus();

    }



    CustomizableUI.createWidget({

        id: widgetId,

        type: "button",

        defaultArea: CustomizableUI.AREA_NAVBAR,

        label: "Aa",

        tooltiptext:
            "ЛКМ — ЗАГЛАВНЫЕ\n" +
            "СКМ — Первая буква заглавная\n" +
            "ПКМ — строчные",



        onCreated: function(button) {


            button.style.listStyleImage =
                'url("data:image/png;charset=utf-8;base64,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")';



            button.addEventListener(
                "mousedown",
                function(e) {

                    // сохраняем выделение
                    e.preventDefault();


                    if (e.button == 0)
                        replaceCase("upper");


                    else if (e.button == 1)
                        replaceCase("title");


                    else if (e.button == 2)
                        replaceCase("lower");


                }
            );



            button.addEventListener(
                "contextmenu",
                function(e) {
                    e.preventDefault();
                }
            );

        }

    });


})();