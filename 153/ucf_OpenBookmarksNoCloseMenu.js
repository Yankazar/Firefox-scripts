/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
// Открывать закладки ЛКМ в новой вкладке,
// не закрывая меню закладок
// xiaoxiaoflood userChromeJS + Firefox 153
(function() {


function openBook(e, target = e.originalTarget) {


    if (
        target.localName != "menuitem" ||
        !target._placesNode ||
        !PlacesUtils.nodeIsURI(target._placesNode)
    )
        return;



    // ЛКМ блокируем стандартное открытие
    if (e.button == 0) {

        e.preventDefault();
        e.stopPropagation();

    }




    // Открытие закладки
    if (
        e.button == 0 &&
        e.type == "mouseup"
    ) {


        let itemUri =
            target._placesNode.uri;



        let current =
            [
                "about:newtab",
                "about:blank",
                "chrome://browser/content/bookmarks/bookmarksPanel.xhtml"
            ].includes(
                gBrowser.currentURI.spec
            );



        let where =
            (current || e.ctrlKey)
            ? "current"
            : "tab";



        openLinkIn(
            itemUri,
            where,
            {
                inBackground:false,
                relatedToCurrent:true,
                triggeringPrincipal:
                    Services.scriptSecurityManager
                    .getSystemPrincipal()
            }
        );



        setTimeout(
            () => {

                let popup =
                    document.getElementById(
                        "placesContext"
                    );

                if (popup)
                    popup.hidePopup();

            },
            50
        );


    }




    /*
    // Удаление закладки СКМ

    if (
        e.button == 1 &&
        e.type == "mouseup"
    ) {

        setTimeout(() => {

            try {

                PlacesUtils.bookmarks.removeItem(
                    target._placesNode.itemId
                );

            }

            catch(ex){}


        },0);

    }
    */





    // Автозакрытие меню при уходе курсора

    let menu =
        target.parentNode;



    if (
        !menu ||
        menu.localName != "menupopup" ||
        e.type != "click" ||
        e.button == 2
    )
        return;



    menu.onmouseover =
        () => menu.f = true;



    menu.onmouseleave =
        () => {

            menu.f = false;


            setTimeout(() => {


                if (menu.f)
                    return;



                for (
                    let node = menu;
                    node;
                    node = node.parentNode
                ) {


                    if (
                        node.nodeName ==
                        "menupopup"
                    )
                        node.hidePopup();


                }


                menu.onmouseleave = null;


            },500);

        };


}




[
    "click",
    "mouseup",
    "mousedown"

].forEach(
    type =>
        addEventListener(
            type,
            openBook,
            true
        )
);



})();