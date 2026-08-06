/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
// ==UserScript==
// @name      Browser search engine
// @author    Vitaliy V.
// @include   main
// @shutdown  window.contextsearch.destructor();
// @note      https://forum.mozilla-russia.org/viewtopic.php?pid=780283#p780283
// ==/UserScript==
// Firefox 153+
const { SearchService } = ChromeUtils.importESModule(
  "moz-src:///toolkit/components/search/SearchService.sys.mjs"
);

(this.contextsearch = {
    topic: "browser-search-engine-modified",
    hide: "browser.search.hiddenOneOffs",
    defaultImg: "chrome://browser/skin/search-engine-placeholder.png",
    searchSelect: null,
    popup: null,
    init(that) {
        var searchSelect = this.searchSelect = document.querySelector("#context-searchselect");
        if (!searchSelect)
            return;
        var popup = this.popup = searchSelect.closest("menupopup");
        popup.addEventListener("popupshowing", this);
      //  that.unloadlisteners?.push("contextsearch"); // OLD UCF
        that.setUnloadMap?.("contextsearch", this.destructor, this);
    },
    destructor() {
        this.popup.removeEventListener("popupshowing", this);
        if (this.popupshowing == this.handler) {
            this.popup.removeEventListener("popuphidden", this);
            Services.obs.removeObserver(this, this.topic);
            Services.prefs.removeObserver(this.hide, this);
        }
    },
    handleEvent(e) {
        this[e.type](e);
    },
    popupshowing(e) {
        var popup = this.popup;
        var searchSelect = this.searchSelect;
        if (e.target != popup || searchSelect.hidden) return;

        var menu = document.createXULElement("menu");
        menu.className = "menu-iconic";
        var menupopup = document.createXULElement("menupopup");
        menu.appendChild(menupopup);
        menu.ePopup = menupopup;
        searchSelect.style.setProperty("display", "none", "important");
        searchSelect.before(menu);
        menu.onclick = this.search.bind(this);
        this.handler = e => e.target != popup || (menu.hidden = searchSelect.hidden);
        this.handlerRebuild = e => this.handler(e) || this.rebuild(menu);
        this.popuphidden = ev => {
            if (ev.target != popup) return;
            menu.hidden = true;
        };
        this.popup.addEventListener("popuphidden", this);
        this.rebuild(menu);
    },
    getEngines() {
        var args = "hideOneOffButton" in SearchService.defaultEngine
            ? [e => !e.hideOneOffButton]
            : Object.defineProperty(
                [function(e) {return !this.includes(e.name);}], "1", {
                    get: () => Services.prefs.getStringPref(this.hide, [])?.split(",") || []
                }
            );
        return (this.getEngines = async () =>
            (await SearchService.getVisibleEngines()).filter(...args)
        )();
    },
    async rebuild(menu) {
    console.log(SearchService);
        var de = SearchService.defaultEngine;
        de = de.wrappedJSObject || de;
        await this.setAttrs(menu, de, `Искать в ${de.name} или в ...`);
        menu.ePopup.textContent = "";
        for(let engine of await this.getEngines()) {
            if (engine == de) continue;
            var menuitem = document.createXULElement("menuitem");
            menuitem.className = "menuitem-iconic";
            await this.setAttrs(menuitem, engine);
            menu.ePopup.append(menuitem);
        }
        this.popupshowing = this.handler;
        Services.obs.addObserver(this, this.topic, false);
        Services.prefs.addObserver(this.hide, this);
    },
    async setAttrs(node, engine, label = engine.name) {
        node.engine = engine;
        node.setAttribute("label", label);
        node.setAttribute("image", await engine.getIconURL?.() || engine.getIconURLBySize?.(16, 16) || this.defaultImg);
    },
    observe() {
        this.popupshowing = this.handlerRebuild;
        Services.obs.removeObserver(this, this.topic);
        Services.prefs.removeObserver(this.hide, this);
    },
    search(e) {
        var {engine} = e.target;
        if (!engine) return;
        var searchSelect = this.searchSelect;
        var submission = engine.getSubmission(
            searchSelect.searchTerms, null, "contextmenu"
        );
        if (submission) {
            let tab = gBrowser.addTab(submission.uri.spec, {
                postData: submission.postData,
                index: (gBrowser.selectedTab._tPos + 1),
                triggeringPrincipal: searchSelect.principal
            });
            if (e.button == 0)
                gBrowser.selectedTab = tab;
        }
        var popup = this.popup;
        e.button != 1 && popup.state == "open" && popup.hidePopup();
    }
}).init(this);