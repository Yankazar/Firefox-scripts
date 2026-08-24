/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
//
// Compact Menu ..........
//
(async icons => CustomizableUI.createWidget({
    id: "ucf_CompactMenu",
    label: "Compact Menu",
    tooltiptext: "Compact Menu",
    // defaultArea: CustomizableUI.AREA_NAVBAR,
    localized: false,
    onCreated(btn) {
        btn.type = "menu";
        btn.setAttribute("image", "about:logo");

        var doc = btn.ownerDocument;
        var menupopup = doc.createXULElement("menupopup");
        menupopup.toggleAttribute("context");
        btn.ownerDocument.defaultView.AutoHideMenubar._setActive = () => {};
        btn.setAttribute("popup", menupopup.id = "main-menubar-popup");
        var bar = doc.getElementById("main-menubar");
        bar.append(menupopup);
        for(var menu of Array.from(bar.querySelectorAll(":scope > menu"))) {

            var popup = menu.querySelector(":scope > menupopup");
            popup.remove();
            menu.textContent = menu.renderedOnce = "";
            var img = icons[menu.id];
                if (img) {
                    menu.className = "menu-iconic",
                    menu.setAttribute("image", img);
                }
            menupopup.append(menu);
            menu.render();
            menu.append(popup);
            menu.disabled = false;
        }
    }
}))({
	"file-menu": "chrome://browser/skin/home.svg",
	"edit-menu": "chrome://devtools/skin/images/webconsole/editor.svg",
	"view-menu": "chrome://browser/skin/reader-mode.svg",
	"history-menu": "chrome://browser/skin/library.svg",
	"bookmarksMenu": "chrome://browser/skin/bookmark-star-on-tray.svg",
	"tools-menu": "chrome://devtools/skin/images/settings.svg",
	"usercssloader-menu": "chrome://devtools/skin/images/tool-styleeditor.svg",	
	"helpMenu": "chrome://devtools/skin/images/info.svg",
	"menu_newNavigatorTab": "chrome://devtools/skin/images/info.svg"
});
// https://forum.mozilla-russia.org/viewtopic.php?pid=810809#p810809