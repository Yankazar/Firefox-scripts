/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
// ==UserScript==
// @name           Zoom
// @include        main
// ==/UserScript==
(function() {

    let widgetId = "ZoomControlButton";


    if (CustomizableUI.getWidget(widgetId)) {
        CustomizableUI.destroyWidget(widgetId);
    }



    const zoomPref =
        "browser.zoom.updateBackgroundTabs";



    function resetZoom() {

        let lc = Cu.createLoadContext();

        let {_cps2, name} = FullZoom;


        _cps2.removeByName(
            name,
            lc,
            {
                handleCompletion() {

                    _cps2.setGlobal(
                        name,
                        1.0,
                        lc
                    );

                }
            }
        );



        let current =
            Services.prefs.getBoolPref(
                zoomPref,
                false
            );


        Services.prefs.setBoolPref(
            zoomPref,
            !current
        );

    }




    function updateTooltip(button) {

        let value =
            Math.floor(
                (ZoomManager.zoom + 0.005) * 100
            );


        let state =
            Services.prefs.getBoolPref(
                zoomPref,
                false
            )
            ? "Вкл"
            : "Выкл";


        button.setAttribute(
            "tooltiptext",
            "ЛКМ — увеличить масштаб\n" +
            "ПКМ — уменьшить масштаб\n" +
            "СКМ — сброс масштабов\n\n" +
            "Текущий масштаб: " +
            value +
            "%\n" +
            "Фоновые вкладки: " +
            state
        );

    }





    CustomizableUI.createWidget({

        id: widgetId,

        type: "button",

        defaultArea:
            CustomizableUI.AREA_NAVBAR,


        label: "Zoom",


        tooltiptext:
            "Управление масштабом",



        onCreated: function(button) {


            // временная иконка
            button.style.listStyleImage =
                'url("data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyAyMDE5IC0tPg0KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIzLjM4NjZtbSIgaGVpZ2h0PSIzLjM4NjZtbSIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgMzM4LjY2IDMzOC42NiINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayINCiB4bWxuczp4b2RtPSJodHRwOi8vd3d3LmNvcmVsLmNvbS9jb3JlbGRyYXcvb2RtLzIwMDMiPg0KIDxkZWZzPg0KICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KICAgPCFbQ0RBVEFbDQogICAgLmZpbDAge2ZpbGw6d2hpdGV9DQogICBdXT4NCiAgPC9zdHlsZT4NCiA8L2RlZnM+DQogPGcgaWQ9ItCh0LvQvtC5X3gwMDIwXzEiPg0KICA8bWV0YWRhdGEgaWQ9IkNvcmVsQ29ycElEXzBDb3JlbC1MYXllciIvPg0KICA8cGF0aCBjbGFzcz0iZmlsMCIgZD0iTTEzNC40OSAyOS4yYzE4MS40OSwtNTAuODQgMjU2LjU5LDIyOS41MiA3NC4yNSwyNzguOTggLTE4MS4wMSw0OS4xIC0yNjQuNzIsLTIyNS42MSAtNzQuMjUsLTI3OC45OHptLTEzMy42NiAxNTYuODVjOC4zMSw4Ny42OSA4Ny45NywxNjMgMTg3LjAyLDE1Mi45MiA4Ny40MywtOC44OSAxNjEuNTYsLTg4LjAyIDE1Mi4xMSwtMTg2Ljg1IC04LjUzLC04OS4xOCAtODguOTcsLTE2NS42OCAtMTkwLjIxLC0xNTMuNDQgLTg2LjczLDEwLjQ5IC0xNTguMjgsODguNCAtMTQ4LjkyLDE4Ny4zN3oiLz4NCiAgPHBvbHlnb24gY2xhc3M9ImZpbDAiIHBvaW50cz0iNzguNzQsMTU2LjY1IDc4LjY4LDE4MS42NiAxNTcuMTYsMTgyLjg5IDE1OC41OSwyNjAuODcgMTgzLjIsMjYwLjg3IDE4My40NiwxODEuOTIgMjYyLjE0LDE4MC43NyAyNjIuMTUsMTU1Ljg0IDE4My43NiwxNTUuNTIgMTgzLjQ1LDc2LjQ3IDE1OC40NSw3Ni41NCAxNTcuMzcsMTU2LjM1ICIvPg0KICA8cG9seWdvbiBjbGFzcz0iZmlsMCIgcG9pbnRzPSI3MS41NiwxNTYuNjUgNzEuNDksMTgxLjY2IDE1Mi4xMiwxODIuODggMTUyLjEyLDE4Mi44OCAxNzkuMTUsMTgxLjkzIDE3OS4xNSwxODEuOTMgMjU5Ljk5LDE4MC43NyAyNTkuOTksMTU1Ljg1IDE3OS40NSwxNTUuNTIgMTc5LjQ1LDE1NS41MiAxNTIuMzQsMTU2LjM0IDE1Mi4zNCwxNTYuMzQgIi8+DQogPC9nPg0KPC9zdmc+DQo=")';



            updateTooltip(button);



            button.addEventListener(
                "mousedown",
                function(event) {


                    if (
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey ||
                        event.metaKey
                    )
                        return;



                    event.preventDefault();



                    if (event.button == 0) {

                        FullZoom.enlarge();

                    }


                    else if (event.button == 1) {

                        resetZoom();

                    }


                    else if (event.button == 2) {

                        FullZoom.reduce();

                    }



                    updateTooltip(button);


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