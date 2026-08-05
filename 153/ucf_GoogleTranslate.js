/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
// ==UserScript==
// @name         Google Translate Context Menu
// @version      2.3
// @description  Версия с исправленным API перевода (без хэша TKK)
// @author       Адаптировано для uc-loader
// @include      main
// ==/UserScript==

(function() {
    console.log("[GoogleTranslate.uc.js] Скрипт успешно подгружен загрузчиком!");

    function init() {
        if (window.gBrowser === undefined) {
            console.log("[GoogleTranslate.uc.js] Ошибка: window.gBrowser не найден.");
            return;
        }
        
        console.log("[GoogleTranslate.uc.js] gBrowser найден, инициализируем меню...");

        var lc = navigator.lastClick = {};
        window.addEventListener("mouseup", e => {
            if (e.button) return;
            lc.X = e.screenX - (window.mozInnerScreenX || 0);
            lc.Y = e.screenY - (window.mozInnerScreenY || 0);
        }, false);

        function getSelectedText() {
            let focusedWindow = document.commandDispatcher.focusedWindow;
            let selStr = focusedWindow.getSelection().toString();
            if (!selStr && gContextMenu) {
                try { selStr = gContextMenu.selectionInfo.fullText; } catch(e) {}
            }
            return selStr ? selStr.trim() : "";
        }

        var createWindow = function(text, status, title, id, pos, size){
            var win = window, doc = win.document, wId = 'ujs_window'+(id || ''), w = doc.getElementById(wId);
            var keyDown = function(e){if(!e.shiftKey && !e.ctrlKey && !e.altKey && e.keyCode == 27)doc.getElementById(wId).closeWin()};
            if(w)w.closeWin();
            
            w = doc.createElement('div');
            w.setAttribute('style', 'position:fixed;display:block;visibility:hidden;left:0;top:0;width:auto;height:auto;border:1px solid gray;padding:2px;margin:0;z-index:99999;overflow:hidden;cursor:move;background-color:#eaeaea;padding-top:0px;border-radius:4px;box-shadow:0 0 15px rgba(0,0,0,.4);');
            w.id = wId;
            w.closeWin = function(){
                doc.removeEventListener('keydown', keyDown, false);
                this.parentNode.removeChild(this);
            };
            w.addEle = function(str, style){
                var ele = doc.createElement('div');
                ele.setAttribute('style', style);
                if(str){
                    ele.innerHTML = str;
                    for(var el, all = ele.getElementsByTagName('*'), i = all.length; i--;){
                        el = all[i];
                        if(/^(script|frame|iframe|applet|embed|object)$/i.test(el.nodeName)){
                            el.parentNode.removeChild(el);
                        }
                        else{
                            for(var att = el.attributes, j = att.length; j--;){
                                if(/^on[a-z]+$/i.test(att[j].name))att[j].value = '';
                            }
                        }
                    }
                };
                return this.appendChild(ele);
            };
            w.addEle1 = function(str, style){
                var ele = doc.createElement('textarea');
                ele.setAttribute('style', style);
                if(str){
                    ele.innerHTML = str;
                    for(var el, all = ele.getElementsByTagName('*'), i = all.length; i--;){
                        el = all[i];
                        if(/^(script|frame|iframe|applet|embed|object)$/i.test(el.nodeName)){
                            el.parentNode.removeChild(el);
                        }else{
                            for(var att = el.attributes, j = att.length; j--;){
                                if(/^on[a-z]+$/i.test(att[j].name))att[j].value = '';
                            }
                        }
                    }
                };
                return this.appendChild(ele);
            };
           var img = doc.createElement("div");
img.setAttribute("style", `
display:block;
float:right;
width:16px;
height:16px;
margin-top:3px;
margin-right:2px;
cursor:pointer;
background:center/14px no-repeat url("chrome://global/skin/icons/close.svg");
-moz-context-properties: fill;
fill: currentColor;
opacity: .85;
`);

img.onmouseenter = () => img.style.opacity = "1";
img.onmouseleave = () => img.style.opacity = ".85";
            img.title = (win.navigator.language.indexOf('ru') == 0) ? '\u0417\u0430\u043A\u0440\u044B\u0442\u044C' : 'Close';
            img.addEventListener('click', function(){this.parentNode.closeWin()}, false);
            w.appendChild(img);
            
            var titleEle = w.addEle(title, 'display:table;color:#000;font:17px Times New Roman;width:auto;height:auto;padding:0;margin:0 2px;cursor:text;');
            titleEle.onclick = e => {
                var anchor = e.target.closest('a');
                if (!anchor) return;
                e.preventDefault();
                var url = anchor.href;
                var ctabpos = gBrowser.selectedTab._tPos + 1;
                gBrowser.moveTabTo(gBrowser.selectedTab = gBrowser.addTrustedTab(url), ctabpos);
                doc.getElementById(wId).closeWin();    
            }
            
            var cnt = w.addEle1(text, 'display:block;border:1px solid #aaa;padding-bottom:3px;padding-left:3px;background-color:#fafcfe;color:#000;font:17px Times New Roman;width:260px;height:100px;overflow:auto;cursor:text;');
            cnt.contentEditable="true";
            cnt.setAttribute("context", "contentAreaContextMenu");
            w.addEle(status, 'display:table;font:12px Times New Roman;font-weight:bold;color:blue;width:auto;height:auto;padding-top:2px;margin:0 3px;cursor:pointer;');
            
            w.addEventListener('mousedown', function(e){
                if(e.target == w){
                    e.preventDefault();
                    var grabX = e.clientX, grabY = e.clientY, origX = parseInt(w.style.left), origY = parseInt(w.style.top);
                    var mouseMove = function(ev){
                        w.style.left = origX+ev.clientX-grabX+'px';
                        w.style.top = origY+ev.clientY-grabY+'px';
                    };
                    doc.addEventListener('mousemove', mouseMove, false);
                    doc.addEventListener('mouseup', function(){doc.removeEventListener('mousemove', mouseMove, false)}, false);
                }
            }, false);
            doc.documentElement.appendChild(w);
          
            if(!size){
                for(var i = 3; i < 10; i++){
                    if(cnt.scrollHeight > cnt.offsetHeight || cnt.scrollWidth > cnt.offsetWidth){
                        cnt.style.height = 40*i+'px';
                        cnt.style.width = 130*i+'px';
                    }
                    else break;
                }
            };

            var docEle = (doc.compatMode == 'CSS1Compat' && win.postMessage) ? doc.documentElement : doc.body;
            var mX = docEle.clientWidth-w.offsetWidth, mY = docEle.clientHeight-w.offsetHeight;
            if(mX < 0){cnt.style.width = parseInt(cnt.style.width)+mX+'px'; mX = 0};
            if(mY < 0){cnt.style.height = parseInt(cnt.style.height)+mY+'px'; mY =0};
            var hW = parseInt(w.offsetWidth/2);
            w.style.left = (pos && pos.X < mX+hW ? (pos.X > hW ? pos.X-hW : 0) : mX)+'px';
            w.style.top = (pos && pos.Y+10 < mY ? pos.Y+10 : mY)+'px';
            w.style.visibility = 'visible';
            doc.addEventListener('keydown', keyDown, false);
            return w;
        };
         
        var ujs_google_translate = function (dir){
            var lng = window.navigator.language.slice(0, 2), txt = getSelectedText(), l = dir.split('|');
            var encTxt = encodeURIComponent(txt);
            var winWait = function(lng){createWindow('', (lng == 'ru' ? 'Подождите идет перевод' : 'Wait, is going Translating')+'\u2026', 'Google Translate', '_gt', window.navigator.lastClick)};
            
            if (txt) {
                winWait(lng);
                
                // Современный стабильный URL, не требующий вычисления TKK токена
                var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + l[0] + '&tl=' + l[1] + '&dt=t&q=' + encTxt;
                var urlt = "https://translate.google.com/?text=" + encTxt + "&sl=" + l[0] + "&tl=" + l[1] + "&hl=" + lng;
              
                fetch(url)
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok: ' + response.status);
                        return response.json();
                    })
                    .then(tmp => {
                        var result = '', status = '';
                        if (tmp && tmp[0]) {
                            for (var i = 0; i < tmp[0].length; i++) {
                                if (tmp[0][i][0]) {
                                    result += tmp[0][i][0].toString();
                                }
                            }
                            // Заменяем переносы строк на теги для HTML отображения
                            result = result.replace(/\n/g, "<br />");
                        }
                        status = l[0].toUpperCase() + ' -\u203A ' + l[1].toUpperCase();
                        createWindow(result, status, '<a href="'+urlt.replace(/&/g,'&amp;')+'" target="_blank" style="display:inline;padding:0;margin:0;text-decoration:none;border:none;color:blue;font:17px Arian;">Google Translate</a>', '_gt', window.navigator.lastClick);
                    })
                    .catch(error => {
                        console.error("[GoogleTranslate.uc.js] Ошибка перевода:", error);
                        createWindow('Ошибка при выполнении перевода. Подробности в консоли браузера.', 'ERROR', 'Google Translate', '_gt', window.navigator.lastClick);
                    });
            } else {
                var urlt = gBrowser.currentURI.spec;  
                var url = "https://translate.google.com/translate?u="+encodeURIComponent(urlt)+"&hl="+lng+"&langpair="+dir+"&tbb=1";
                var ctabpos = gBrowser.selectedTab._tPos +1;
                gBrowser.moveTabTo(gBrowser.selectedTab = gBrowser.addTrustedTab(url), ctabpos);
            };
        };

        var contextMenu = document.getElementById("contentAreaContextMenu");
        if (!contextMenu) {
            console.log("[GoogleTranslate.uc.js] Ошибка: Не найдено контекстное меню браузера.");
            return;
        }

        var menuId = "context-ext-google-translate-ru";
        var menuIdEn = "context-ext-google-translate-en";
        var sepId = "context-ext-google-translate-sep";

        let oldRu = document.getElementById(menuId); if (oldRu) oldRu.remove();
        let oldEn = document.getElementById(menuIdEn); if (oldEn) oldEn.remove();
        let oldSep = document.getElementById(sepId); if (oldSep) oldSep.remove();

        var nextEleMenu = document.getElementById("context-inspect") || contextMenu.firstChild;

        var menuItemRu = document.createXULElement("menuitem");
        menuItemRu.setAttribute("id", menuId);
        menuItemRu.setAttribute("label", "Перевести на русский");
        menuItemRu.setAttribute("class", "menuitem-iconic");
        menuItemRu.setAttribute("image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABnRSTlMAAAAAAABupgeRAAABBUlEQVR4Ac2RMU4DMRREB2MqihQpAkUaqnAduuQw4Sx03CGcJYIiDYqQ0lCsZ77535ZFcgAkRuPvV7zd/dLiz3N1PFb8hmRckrfELZrF9ONQ1B6Yz0MyM7S0O6zGkVprh/3+Kw/JzkHSpRpJKZkpr9fYbOx0cjVsCbWG31oHBM9mtt0q73ZcrdLhAMlYQKkUI22aqsNo8HKZAMQhvVaKSHWj2Q2aPU3mJQFY7nuHyvYFduP83WF3AJRfcPNYnr/Lp1G1uK4m9sno1LaUbnX/htf8BNzoneUD5NhjvLCMhURQSQ93QCZwXYjFwg3I0NZKrvoknQPMIHkt/jRAQKMeG2yX89/mB4EJbKbZxIhFAAAAAElFTkSuQmC");
        menuItemRu.addEventListener("command", function(){ujs_google_translate('auto|ru')}, false);
        contextMenu.insertBefore(menuItemRu, nextEleMenu);

        var menuItemEn = document.createXULElement("menuitem");
        menuItemEn.setAttribute("id", menuIdEn);
        menuItemEn.setAttribute("label", "Перевести на английский");
        menuItemEn.setAttribute("class", "menuitem-iconic");
        menuItemEn.setAttribute("image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABnRSTlMAAAAAAABupgeRAAAB5UlEQVR4AWOgPZg0c9+Oq2+qpx9LaQaiw4mNB27efbs2uXFNQh2Q4Zm9zSNth23MhqjGnXMC86vnHmUS4udxv7OvOd2yPE7PTlfCTk9GVVEoyJA7WI8dyPA0k3U1l+jJMV7CeThpTZeoKDdDUsvBPSff/V+6/P/Bvf///2+bdvU/EKRm/k9IBNIlfZe+LFrzvbsbyJ636pKkyQyQhoUb7tZNvPpw3/0/TfX/ISAm5n94BIiRm/n/xYsLd946ei4vajoiqDuRAejQf//+o4PQ0P9+fmhiQGVnrr1kXJNYG2zEzXDxDsPv3wy/fkFJoOTPn39+/fr/69e/37//AUX+/mXRkO458wWHDba2f8wswCyQ3N+/f//8/fP7z5+TV18w2Mdt6plzPiptx5Wr7/+/ffMzOR6kysjkt74hWMPfp06O+2dulZCeFZKwnkE4m8E8bN3i9aCQ+dxY96GrK6bkGJD9R1v3l6Y20NVW9kt+/v//ZdbcFwkxTVPPMQimM8XEqkb7a/zoqLxkH9v4zVyI5+///wyMmtKMmhJAnbLqQjHxaw5r2orOmZN5uj470Zahat6BKS7JzpmLBHXm8GhM5lCdcP7ai1ZpixZxk9NXXjKIFzOIFjAI54oY1vXuue5qmscw+AAAW0tKxtPoicEAAAAASUVORK5CYII=");
        menuItemEn.addEventListener("command", function(){ujs_google_translate('auto|en')}, false);
        contextMenu.insertBefore(menuItemEn, nextEleMenu);

        var separator = document.createXULElement("menuseparator");
        separator.setAttribute("id", sepId);
        contextMenu.insertBefore(separator, nextEleMenu);

        contextMenu.addEventListener("popupshowing", function() {
            let hasText = !!getSelectedText();
            menuItemRu.setAttribute("label", hasText ? "Перевести текст на русский" : "Перевести страницу на русский");
            menuItemEn.setAttribute("label", hasText ? "Перевести текст на английский" : "Перевести страницу на английский");
        }, false);
        
        console.log("[GoogleTranslate.uc.js] Контекстное меню успешно создано.");
    }

    if (document.readyState === "complete") {
        init();
    } else {
        window.addEventListener("DOMContentLoaded", init, { once: true });
    }
})();