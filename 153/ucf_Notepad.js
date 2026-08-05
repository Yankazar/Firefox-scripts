/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
// ==UserScript==
// @name           Notepad
// @include        main
// ==/UserScript==
(function() {

    let widgetId = "pasteNotepadButton";


    if (CustomizableUI.getWidget(widgetId)) {
        CustomizableUI.destroyWidget(widgetId);
    }


    let defaultURL =
        'data:text/html;charset=utf-8,' +
        '<textarea id="req_message" ' +
        'style="width:1200px;height:450px;"></textarea>';



    function openNotepad() {

        let msg =
            widgetId + ":NotepadPageShowAndPaste";


        let url =
            "data:," +
            encodeURIComponent(`

            addEventListener("pageshow", () => {

                let box =
                    content.document.getElementById(
                        "req_message"
                    );

                box.focus();

                docShell.doCommand("cmd_paste");

                sendAsyncMessage("${msg}");

            }, {once:true});

            `);



        let clip = "";

        let busy = 0;


        let listener = function() {

            if (clip) {
                try {
                    Services.clipboard.copyString(clip);
                }
                catch(e){}
            }

            busy = 0;

        };



        Services.mm.addMessageListener(
            msg,
            listener
        );



        if (busy &&
            Date.now() - busy < 4000) {

            return;

        }


        busy = Date.now();



        try {

            clip =
                Services.clipboard.getData(
                    new String()
                );

        }
        catch(e){}



        goDoCommand("cmd_copy");



        setTimeout(function() {

            let tab =
                gBrowser.addTrustedTab(
                    defaultURL
                );


            gBrowser.selectedTab = tab;


            gBrowser
            .getBrowserForTab(tab)
            .messageManager
            .loadFrameScript(
                url,
                false
            );


        },50);

    }





    CustomizableUI.createWidget({

        id: widgetId,

        type: "button",

        defaultArea:
            CustomizableUI.AREA_NAVBAR,


        label: "Блокнот",


        tooltiptext:
            "ЛКМ — открыть блокнот и вставить текст\n" +
            "СКМ — боковая панель",



        onCreated: function(button) {


            // Иконка (можно заменить на свою)
            button.style.listStyleImage =
                'url("data:image/x-icon;base64,AAABAAEAEREAAAEAIADwBAAAFgAAACgAAAARAAAAIgAAAAEAIAAAAAAAyAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAgAAAAApKSlRRkZGh0BAQHxBQUF+QUFBfkFBQX5BQUF+QEBAfEZGRogaGho1AAAAAAABAAECAgICAgICAgQEBAUAAAAAMTEwWeLi4f//////+vr6//r6+v/6+vr//Pz8//v7+//5+fn++/v7/7CwsPdNTU2hAQEBAgAAAAAAAAAAAwMDBAAAAABvbm+x8vHy/+Df4Pfi4+P76ubr++Lh4vvk5OT7/f39+/////v////77/Dv/aysrP8BEAElKngnxDCDLdEvgSzOLX8qy0GTPu1Zq1b/WatW/lasU/9op2f/xcPF/8PEw//i5+L/8vfx//H27//p6+n/qqqq/ESaQOS67a7/teip/rbpqv+36qv/suSm/6zfoP+s36D/teOo/4bNfP93s3b/39bf/9XY1f/5/Pj/+Pv2/+vs6/+qqar/T6RK8bvjsP6t2qT8sNym/LDcpvyx3af+st6o/7LeqP+w3ab/vuaz/1mqVP+2w7b/3dvd//D07//4+/f/6+zr/6qqqv8BNwFvndiU/8Djt/y34a//ueGw/7nhsP+54bD/ueGw/7jgr//B5Lj/mtSS/3q1ev/WzNb/4ufh//f79f/p6+n/qqqq/wAAAANHk0Pbzu/F/73gtP3A47f/wOO3/8Djt//A47f/wOO4/73itf/D5rn/Y7Je/7/MwP/k4eP/+f35/+vs6/+qqqr/AAAAAAAzAGap4KP/zebG+8Tkvv/G5b//xuS//8blv//F5b7/vuK2/8LkuP+U0Yv/ZaBl/97W3v/u9e3/6+3r/6qqqv8DAQMAAAAABE6XS+Db8dT/yuPD/czmxv/N5sf/zObG/8blv//A47j/t+Cu/7vjsP9nuWP/uMW5/+zr6//s7+z/qamq/wACAAQAAAAAATQBZrTir//a6dX70ufN/9Pozv/N5sf/xuS//8Djt/+44K//u+Ow/4zNgv9uqW7/6+Tr/+ru6v+qqar/AAAAAQMBAwAAAAAHVJhS2Or25v/W59L91OjP/8zmxv/G5b//wOO3/7rhsP+w3ab/tuSp/1isU/+vva//6+rq/6qqqv8AAAAAAQIBAwAAAAAENQRkv+S7/+Pr3vvR58z/zObG/8bkv/+/4rf/ueCw/7Hep/+z4Kf/h818/3Kucv/r4uv/qKqo/gAAAAAAAAABAwEDAAAAAApVl1TU7Pbo/9HlzP3P58j/xuS//8Ljuf+64bH/s9+p/6vcoP+t4KD/Wq5U/8bSx/23tLf9AAAAAAAAAAABAgEDAAAAAAk3CWaq36b/1unR+cLjvPzF5r78t+Cv/LXgrP2w36b8odmW/Kzgn/1yxGf7gLKA/52Sne0AAAAAAAAAAAAAAAECAQIAAAEADUOCQcdwt23/Zati82GrXvVjrWD4XKlY9FqpVvZaqlX3UqZN81OnTvxYbFndGxcbNAAAAAAAAAAAAAAAAAABAQEAAAAAFBAUHTAzMGcqKipRJSclUS8wL14nJyZNKCspVy4uLlsiJCJKNjU2aQQABAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=")';



            button.addEventListener(
                "mousedown",
                function(e) {

                    e.preventDefault();


                    if (e.button == 0) {

                        openNotepad();

                    }


                    else if (e.button == 1) {

                        SidebarUI.toggle(
                            "viewBookmarksSidebar"
                        );

                    }

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