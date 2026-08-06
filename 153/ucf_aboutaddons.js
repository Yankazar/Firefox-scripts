/*Дополнительные пункты контекстного меню на странице about:addons для аддонов, плагинов, тем, CB*/
/*https://forum.mozilla-russia.org/viewtopic.php?pid=804854#p804854*/

/**
@UCF @param {"prop":"JsChrome.load","ucfobj":true} @UCF
*/
/**
@UCF @param {"prop":"JsBackground","disable":false} @UCF
*/ 
(async (css, self) => ({

	//===[ Buttons ]===================================================================

	vertical: true,
btnActions: [
    "preferences",
    "remove",
    "install-update"
],

	cn: "ucf-cloned-button",
	update(e) {
		var trg = e.target;
		trg.nodeName == "ADDON-CARD" &&
trg.addon &&
trg.addon.type != "theme" &&
this.onCard(trg);
	},

onCard(card, again) {

	var btnsParent = card.querySelector("addon-options");

if (!btnsParent) {
    if (again || !card.ownerGlobal)
        return;

    return card.ownerGlobal.requestAnimationFrame(
        () => this.onCard(card, true)
    );
}
	var doc = card.ownerDocument;

	var [span] = card.getElementsByClassName(this.ccn);

	if (span) {
		return;
	}

	let more = card.querySelector("button.more-options-button");

	if (!more)
		return;

	more.before(span = doc.createElement("span"));

	span.className = this.ccn;


var item, num = 0;

for(var sel of this.btnActions) {

    let original = btnsParent.querySelector(sel);

    if (!original)
        continue;

    if (sel.includes('install-update')) {

        item = doc.createElement("panel-item");

        item.textContent = "Update";

        item.dataset.action = "install-update";

        item.onclick = e => {
            e.stopPropagation();
            original.click();
        };

    } else {

        item = this.clone(original);

    }

    span.append(item);

    item.classList.add(this.cn);
}
},

	//===[ Popup ]=====================================================================

	items: {
		"Копировать имя": [
			addon => self.copy(addon.name),
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByUlEQVQ4jY2TTUhUURiGn5tD0Sp00iAwXM1iFu4kWkUZg/9MoZQhdoUCV7ooItq4atFORRGkuLMwoc0kNBGKDLSwFpEIQgspqGUUNsjI3HvPX4s7I3Nn7oW+1fn5vvd8z3vOsYiIgXuPneFMr21ZVmh9+m7GisoPxcTsM2d46on5c1gy9bHgvDVR+afqJzNzy870xIgNUJGGkqf4XVEAuJ4XeWCiNpibX3MGr/XYPd0pADxlOK0MQgf7Xw++sfJq0zRiJQAWcgWndHRkr28UWcrlAfCVwa8KrK4XOPxbYqz/MsnWcyfFi7lCIPD9x0/70YNRykKz+eELQkny74sIJbnQmqQ71UVhe+cES2hoP9uC63mBgO/7dF7s4NexZPRmBqlBaMPHnc+kL7UTh1VxqwKuGxjkaUP+zRZCSVqwKJeP2dvdj8SqGZuod9hXhr6hGwgNL5ZfEoc1PnaL2sFNAlvvthFKxmJJbfCUqXbghhHSyTOkJwcBmHr4vAnLVwKhJEPZbLgDXwh678yG7rfjfLIJS2qD0IEP9R6kiq8XrzS+sOz9p5+asKodXB0YCQkcNBbHYUXlxP6u67dnIj9PY8QJpIC2/6iX/wDxeTOAfNDrywAAAABJRU5ErkJggg==",
		],
		"Копировать ID": [
			addon => self.copy(addon.id),
			"Копировать имя"
		],
		"Копировать версию": [
			addon => self.copy(addon.version),
			"Копировать имя",
			addon => !addon.version
		],
		"Копировать имя и версию": [
			addon => self.copy(addon.name + " " + addon.version),
			"Копировать имя",
			addon => !addon.version
		],
		"Копировать URL кнопки": [
			(addon, win) => {
				var btn = Object.assign({
					parameters: {},
					get initcode() {return this.initCode;},
					setText(doc, name, t, cds) {
						win.custombutton.buttonSetText(doc, name, this[name], cds);
					}
				}, win.custombuttons.cbService.getButtonParameters(addon.buttonLink));
				self.copy(win.custombutton.buttonGetURI(btn));
			},
			"Копировать имя",
			addon => addon.type != "custombuttons"
		],
		"Домашняя страница": [
			(addon, win) => win.openURL(addon.homepageURL || addon.reviewURL.replace(/\/reviews\/.*$/, "/")),
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAC4jAAAuIwF4pT92AAAIIklEQVRYR61Xa1CU1xlGUNTpr/7rdNr+sCbt2DrRphPb0VZnWtsYhk5tNWnaaHHaVJsoWgWVNlRbMQoaE6poQATkLpdlWVAzLusqLgioi9xEdkGIIJdd9vLt5dvbd76n7/ncdaxigLbvzDNnYc6e5znP+55z3o2KeibmzZsXNX/+/KhYwvz/M/ja08VXCN8mvEx4KTz+r3gpjG8RvkqYGzVVzJkzJ5qGH+3Zs+diUVGxMTc393Zefr4xn6OgwFgQwfnzxvMRFBY+QWEERUXPfabv3S4vL29PTk7OI475xPW8gOjoaK5sTf3Fi8OgcHs88Pn98AcCCISCCIZCCEkSJMYUMFmGjJlFZN4VrbadOGKJ63kBpCqGhtVl5eV9gsvFHg4Ph0bHxtjY+Dgbn5hgExwWi4Jxi5VZrJPMOslhY1abnVlotNntzM7hcChwhDFpswVJPKuurm6Kms6BiooKs1cUwcktViuIBLSAAiKC2+VEUBTgdTng87rgF10I0N9ykBzzuuEUXHC53HC53XCH4RQECeSYuqbmJhcwpQNPBFRWmkWfD+O08wg57RJOp4OInTAPW1FmeIjTegu2fGpEwulOpNePotzwOR6M2UmIF16vlwR44PESKJUul0viaVCr1dMLqCQBPO/c8gi51+0EWY6shhEk5D7A91Nv4Y1jXViZ2oR1Gb1IrAghIWcMm7O6kasfgUC7Dvp9JECESG6SCxKvAXVt7fQCqqqqzIFgEBbKNbfcQ5YPjFjwx3MD2FLixHf3NmJlih7xaQZsy+7Gscs2nNCKyLwK7C624O3MXhxUj2PU5kIo6CcBPnLEowionakAXvGUf8Ztn7Tb8bdaO9K1AdR1BLEq1YC3jt/Ce9md2F/Sj8o7Iq71yShplXHsCrAzfxDb8kZx5JIAF6UiGAyAakoRoNFoZiCgutockriASRbwOlB0U1B2d80EpF+ZxC/T27DjbCfOUjpO1D9Ck0lEozmEXIOIQxoBf84fQWJeP94vFZGlHSHaEKXCqwioq6ubXkC1IkCC02FjD8YcSLssIbsxgB8evIlXknTYkN6KxNweHK8bwflGJ3pGQ3hoZ7jZ78fZay7sr/JgU5YJKSofXs/oocJ0QgoFZu7AYwEMotvGtD0iDtQz/PhQO6LerMJr+69h47E27Dz3WEChQUD/RAjEgfaHMloHgdIWCX/KNuEDtRcr03qQ2zBE1NIsHFCpzBKTSYCDFRh82K0KYFlKK6LfUmFZ0lWsP9qC93K6cLBiCFVtDrolZQxYGK7eZ8hrkpHZEMTRmkF8og3iB4f6sLvoPl0BjwXU19dPL0BVU2OmO4Oq38HO6EUkVYtIqZ7AkiQ9vrb1EtYdasbvM43kQi/OXHkEhxe4Nwpo7wF5zUBSuYCt2X1IuyhhyT4jtuaaZudADTnAb28uIEvnxbZiAUkVNuwoHsSXNqmxZJcW8YdbsDnzDv6Q1YF/XRrGZx0e5DSM4UONFbsKR/B+3hD+WQ/86vQj/J2OJFhw9g74vQL7VOckBwI4chnI0ss4XGfFig8asZyK8Q1yYsfZDqSW3sO+wm5syGjB6tRGbD7Vhb9SIXIB79K9UdDipRSEZi6ghgTwyZLfzWpvT2JrkYB/UCEe1IBOA+i8Syiho7k1pwO/PtaC19Oa8WqynpxpwJcT1PjFifuK4AN1DG/nWHG9L8CP4iwEqNWKAL/oZoNU3m9mDiG52otUjYQDGllZ/BS58c3EBkRtqMLCd9SUmloaCZvq8ErKHWXuPirefZUiHHQLhwI+SSZbwzUw9XMcEaAOC6BXjQEBfKQZovt+iFLhxF8qPUipkbCnwoVl+9uwaOcNfH37NXyD8PLuZryW2o6fHunDtiIndpT6ob4tkpWiLAjuEF+T1m6OmqkD9KSyQMAPwSPiNx934+cZJiSqRrBPY6FLRsDvzoxi/SdDiPvoAeIJG04+xJZzVtq1F9tLfDhU44DN7oBLcMo2m12iYOHXMPYL+4GIAx6Pm/GHhNG1PDLpwfqMdvzk4x7sqBhGRr0HJ3UBHP8sgLQ6Pz0+fqp2brkP72TbkVw6hs/paXYLDtlisWJ4eCRIAlBcXNxAHHO+OAW1tYoAasmYn1oyn8+viHC4fThM9bn+TB9WpfWR1YPYeHIMvz1jwcZTE4g7Pox4cildNQBT/yB6ujtlQ9NNNN64IZlMZrm1tdW6ePHiFZxrzlQWRATUPnHAQykIKO/5+PgE+vvN6Ll7CyWqS3j3wwtYlViOV7fXYMVODX62V41tR1UoU1/BndYbuFBeJtdqNDAYDKy3t5fdvXvXv3Tp0rgw+XPc/ykg7AB1NYoA7oIgCBgdHYXJ3I/7PV3oNrbgVvN13LiuQ1OjHrdbGpX/3evuQIPuqkxtHV+C8UZkYGAAa9asSQhzvIB9CgGecAqC1JyEqD9g1AlH4ulumNG7wdPEe0G73SHTrqHX66mXcEq0e8TFxe2aljw8QemKSYDpaQc4uIiIEA5eUFwQH7lI3njabDaZu3Tp8mWpq6tL5juPj49XyKfM+bNBc7gDq1UqVR+RSNRIBin/ks/nk4hEAYl5AhKkjCRU4ru1Wq2S2WwOGo1GdHZ2+teuXbuFrzvtziMRdmCNTqd7hP8iuCO8YNva2izLly9fF15zivP2ggj/NPvO3r178y9cuKCjM6stLS3VlZWVPQH9vHoONKeBn2/6qabNyclRLVq06Ht8vRiKaSinjNgw5s4CMU99VmJWO382YmNjoxcuXBizYMGCuYSYFyE859l588KpnHH8G9SEW7QrlTX7AAAAAElFTkSuQmCC",
			addon => !addon.homepageURL && !addon.reviewURL
		],
		"Поиск на АМО": [
			(addon, win) => win.openURL(
				addon.homepageURL || ("https://addons.mozilla.org/search/?q=" + encodeURIComponent(addon.name))
			),
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJGSURBVDjLjdJLSNRBHMDx78yqLZaKS75DPdgDDaFDbdJmde5QlhCJGxgpRJfqEEKnIsJLB7skQYQKZaSmdLaopPCgEvSCShCMzR5a7oq7/3l12RVtjfzBMA/4fWZ+MyOccwBM3g8HEbIdfCEhfAFnLVapOa28Uevpjrqz/WOsERJgsu9Uq5CZQzgqrJfo9BajNd5irEYn4p3OUiFExtCLmw2tawFi4l5zUMjMIau9u7K+qxeoAcoAA0wDb2OPwmfA16LiiaOHLj1edRLpkO3WmIis7+oBDgJbgQ2AH6gC6jY19N62RkcctKeVIJAhp9QgUA3kJXdONZVcq9JxPSgQoXRAyIDRth8oAXQyKdWnoCKrTD9CBv4GMqx1WGNZkeRWJKbG2hiD1Cb9FbTnzWFdY/LCdLKlgNQ84gyNKqHm0gDjqVHnxDHgA/B9RQkpaB6YklkZl62np9KBhOqwjpKFgeY2YAz4BESBWHI8Hhs6PVVSvc3v98ye4fP7T676B845nt040ip98qpWJmI9PWiU6bfWgXGN2YHcKwU7tsuc4kpUPMbU0+f8+vKt+Pitl7PLAMDI9cNBoB0hQwICzjqUp6MZvsy8yvp95BRuQUjJ75mPvH4wYo1NlJ64Mza7DPwrhi8cCOeXl/aUB4P4c/NJxKLMvpngycCrzxVFG2v/CwAMnguF80oLe8p27cQh+fnpPV/fTc95S6piXQDAw7a9YbWkezZXFbAwMx/xPFXb1D3+Y90AQF/L7kAsri9mZ4lrTd0TcYA/Kakr+x2JSPUAAAAASUVORK5CYII=",
			["custombuttons", "theme", "plugin"]
		],
		"Папка установки": [
			addon => self.getFile(addon).reveal(),
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAklEQVR42mNkoBAwAjEXEAcCMTsW+U9AvB6I/+I0gJ2Noe3QJoZKASEgjwkq+h+C795lYPCKZMgC8mZg0fsfbICIIMOcF6cZkrGZ/v8fA0PndIa/7z8BXfAPqgVKv//A8GPeZoYERmE+hjmP1+AwAOgiTjOIP7HZLyjLMJNRmB/ogjMMyYzsUC8wIhQwsgCFWHAHoKAy0AARIYY5r69idwEhIKgBMgAYBq8vkGmALsyAU2QaYAwz4CiZBliADBAAGnCATANsYQbsJtMAJ5ABwGh8uZE8A4R9gAYwMzHkT8hl6Bfgxp5ecIH3Xxj+F05hyIdpUmXAnpnwge9AfJckW7EBAC/gSzisxsnmAAAAAElFTkSuQmCC",
			["custombuttons", "theme", "plugin"]
		],
		"Файл установки": [
			addon => self.getFile(addon).launch(),
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA51AAAOdQG5Y1EyAAAAhklEQVQ4y6WT0QnAIAxE78Bt2v1cod3PznP9kVLTRKUGBD+Sd5eQUBJWggCWCAkAJPGXOqlUPyVKkrSPQIoCQJGE6AF4HFyGuBmrR3cGQX8Wmp2cL8Cqv5JPD5Zm1D0nFZjTjHpQ7DuI1L3iBjBS9/pvhtjr21OukVkXiX/ug6SWj4mr53wDMz1vldHlLJkAAAAASUVORK5CYII=",
			["custombuttons", "theme", "plugin"]
		],
		"Проверить обновления": [
       async (addon, win) => {
        const { AddonManager } =
            ChromeUtils.importESModule(
                "resource://gre/modules/AddonManager.sys.mjs"
            );

        AddonManager.getAddonByID(addon.id).then(a => {
            a.findUpdates({
                onUpdateStarted() {},
                onUpdateAvailable() {},
                onUpdateFinished() {}
            });
        });
    },
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAACVUlEQVQ4jXWT30vTYRTGP3Mb+ZbiXmm6DGUO0pkQGQR2URBdKZWWIHRlFHYhXnQRdVUEBUn/gBddFZERaalUoAUhYUglVIjO5TKbjMDtq2vDQ9t8u0jnr3Xgvfuch/M87zk2rTX/K+u05QROUMBVlrmkn+lvWxlHzsbjVj4uzlHFFec15/7UYCrFU6xcrF0ptbn5jNVADS9o47yvxed24yZRnchLz6dbpUSUlMhHNavSa3zeNskMIZzYOQChPyGmolNIXGz+Tn/lvu59d6jhtdVkZX1vm0AFVFSKpZfPNHKQ3SSBPsxCfMEWi8Rwtbkq5L3UqnH1OCtgNVleqRaf+MUjXrH0Sx2TUuklQAt+XPRykyAzFHNIfgkUUyV58k4FVOifhVLe0sUnGhknnyoAPaAjzHGUbkYxjOlHup0R7iPATqCI9vUMHHhwAR7SGCJrdnS/DjPOMd2nhwD4zS2CZEgCBRxZF8gQJgrkYwcqNmaiJ3QGMADMMMsyMeyAE/e6QII3TEP54XIbhXSufqfXarEebEwcH7swFBIDUqSyIYpPFrFzIV4ZhwLqBDGskOE6XUxwUsqkRwWVyF6xscw0P3lOgodqSgXRWqO1tnGZVwxiiGAYw3CbpWbTbDpMh+EGH2jDvcpuetk9EK8ME6UBQwkOoJUdc445RodHqb9YXxaeDJ8StwyogIrnXGUVUEkplx7mKWKJWn7gTH1PwQqEv4bBQRHzLKlJNbJRwJbrGq2zlps9fKEOD5MIEZ6Q5K7u1xNb2ZzXiEFYxDBEF8I9PaBDOTngLwkg8PzzO00cAAAAAElFTkSuQmCC",
			addon => !addon.applyBackgroundUpdates || addon.isBuiltin
],
	},
	listContainerId: "ucf-aa-extra-items-container",
	showing(e) {

		var card = e.target.closest("addon-card");
		if (!card) return;

		this.labs = [];
		var imgs = new Map();
		var set = (key, val) => imgs.set(key, imgs.has(key) ? imgs.get(key).concat(val) : [val]);
		var entries = Object.entries(this.items);

		entries.forEach(([lab, [func, img, hideOn]], ind) => {
			this.labs.push(lab);
			(this[lab] = func).hideOn = hideOn;
			img && set(this.items[img]?.[1] ? entries.findIndex(a => a[0] == img): ind, ind);
		});
		if (imgs.size) {
			var cspRe = /^(?:chrome|file|jar|resource|moz-extension|https?):/;
			var [s, p, o] = this.vers >= 110
				? ["::part(button)", "background-image", "AUTHO"] : ["", "--icon", "USE"];

			var reg = [], push = (ind, icon) => {
				var chromeImg = "chrome://user_chrome_files/content/aaepiimg_" + ind;
				reg.push(["override", chromeImg, icon]);
				return chromeImg;
			}
			var rules = [];
			for(var [ind, nums] of imgs) {
				var sel = [], img = entries[ind][1][1];
				for(var num of nums) sel.push(
					`\t#${this.listContainerId} > panel-item:nth-child(${num + 1})${s}`
				);
				rules.push(`${sel.join(",\t\n")} {\n\t\t${p}: url(${
					cspRe.test(img) ? img : push(ind, img)
				}) !important;\n\t}`);
			}
			if (reg.length) {
				var ams = Cc["@mozilla.org/addons/addon-manager-startup;1"]
					.getService(Ci.amIAddonManagerStartup);
				var mUri = Services.io.newFileURI(Services.dirsvc.get("ProfD", Ci.nsIFile));
				this.chromeReg = ams.registerChrome(mUri, reg);
			}
			this.regSheet(`\n${rules.join("\n")}\n}`, o + "R_SHEET");
		}
		delete this.items;

		self = this;
		this.sym = Symbol.for(this.listContainerId);
		(this.showing = e => {
   
			var card = e.target.closest("addon-card");
			card && this.onListShowind(card.addon, e.target);
		})(e);
		this.onListShowind(card.addon, e.target);
	},
	async onListShowind(addon, list) {

    const doc = list.ownerDocument;
const win = doc.defaultView;


    let container = doc[this.sym];
if (!container) {
    container = doc[this.sym] = doc.createElement("div");

    container.onclick = this.cclick;
    container.id = this.listContainerId;

    for (const lab of this.labs)
        container.appendChild(this.createPanelItem(doc)).append(lab);

    container.mo = new win.MutationObserver(this.mut);
    container.mo.container = container;
}
		for(var item of container.children) {
			var h = this[item.textContent].hideOn;
			item.hidden = h && (h.call ? h(addon) : h.includes(addon.type));
		}
		var {mo} = container;

		if (mo)
    mo.disconnect();

		list.contains(container) || list.prepend(container);

		mo.count = 0;
		mo.ts = Date.now();
		mo.observe(list, {childList: true});
	},
	mut(muts, mo) {
		if (++mo.count > 10 || Date.now() - mo.ts > 100)
			return mo.disconnect();
		var list = muts[0].target, {container} = mo;
		if (list.firstElementChild != container)
			mo.disconnect(),
			list.prepend(container),
			mo.observe(list, {childList: true});
	},
	cclick(e) {
		e.stopImmediatePropagation();
		this.parentNode.hide();
		self[e.target.textContent](
			e.target.closest("addon-card").addon,
			e.view.windowRoot.ownerGlobal
		);
	},
	copy: str => (self.copy =
		Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper).copyString
	)(str),
	getFile(addon) {
		var file, uri = addon.getResourceURI();
		if (uri instanceof Ci.nsIJARURI) uri = uri.JARFile;
		if (uri instanceof Ci.nsIFileURL) file = uri.file;
		return file;
	},

	//================================================================================

	init(topic, quit) {
		Services.obs.addObserver(this, topic);
		Services.obs.addObserver(quit = (s, t) => {
			Services.obs.removeObserver(quit, t);
			Services.obs.removeObserver(this, topic);
		}, "quit-application-granted");
	},
isTargetDoc: doc =>
    doc.URL == "about:addons",
//
	observe(doc) {

    if (!this.isTargetDoc(doc))
        return;

		var vers = this.vers = parseInt(Services.appinfo.platformVersion);
		this.ts = `${vers >= 111 ? "moz-toggle" : "input"}[action="toggle-disabled"]`;

css = css.replace("%TS%", this.ts)
    .replace(/%CN%/g, this.cn)
    .replace("%FD%", this.vertical ? "column" : "row");

let style = doc.createElement("style");
style.id = "ucf-aboutaddons-style";
style.textContent = css;

		var unload = e => {
			e.target.removeEventListener("update", this, true);
			e.target.removeEventListener("showing", this, true);
		}
		var load = doc => {
			doc.addEventListener("update", this, true);
doc.addEventListener("showing", this, true);

let mo = new doc.defaultView.MutationObserver(() => {
    for (let card of doc.querySelectorAll("addon-card"))
        this.onCard(card);
});

mo.observe(doc.documentElement, {
    childList: true,
    subtree: true
});

doc.defaultView.addEventListener("unload", () => mo.disconnect(), {
    once: true
});

doc.documentElement.appendChild(style);
	
			var win = doc.defaultView;

			win.addEventListener("unload", unload, {once: true});
			this.inactiveAddonsVersion(win);
		}
		this.handleEvent = e => this[e.type](e);
		this.ccn = this.cn + "s-container";
	

this.btnActions = this.btnActions.map(
    action => action.includes("panel-item")
        ? action
        : `panel-list > panel-item[action="${action}"]`
);
		this.createPanelItem = vers == 110
			? doc => new (doc.ownerGlobal.customElements.get("panel-item"))
			: doc => doc.createElement("panel-item");

if (vers >= 89) {
this.clone = item => {
    let clone = item.ownerDocument.createElement("panel-item");

    for (let attr of item.attributes) {
        if (attr.name == "hidden" || attr.name == "badged")
            continue;

        clone.setAttribute(attr.name, attr.value);
    }

    clone.onclick = () => item.click();

    return clone;
};
} else {
	var cf = function(e) {
		var win = e.view;
		win.InspectorUtils.removeContentState(this, 4, true);
		Services.focus.clearFocus(win);
	}
	this.clone = item => {
		var clone = item.cloneNode(true);
		clone.onclick = cf;
		return clone;
	}
}

		load(doc);
	},
	inactiveAddonsVersion(win) {
		var desc = win.Object.getOwnPropertyDescriptor(win.HTMLElement.prototype, "title");
		var {set} = desc, cfg = {attributes: true, attributeFilter: ["title"]};

		var handleMuts = function(m, {trg, val}) {
			this.disconnect();
			var txt = trg.firstChild;
			if (txt) txt.data = txt.data.replace(trg.closest("addon-card").addon.name, val);
		}
		desc.set = function(val) {
			set.call(this, val);
			if (this.getAttribute("data-l10n-id") != "addon-name-disabled") return;

			var mo = new win.MutationObserver(handleMuts);
			mo.val = val;
			mo.observe(mo.trg = this, cfg);
		}
		for(var Elm of [win.HTMLAnchorElement, win.HTMLHeadingElement])
			win.Object.defineProperty(Elm.prototype, "title", desc);
	},
regSheet(...args) {
    var prfx = "data:text/css;charset=utf8,";

    var sss = Cc["@mozilla.org/content/style-sheet-service;1"]
        .getService(Ci.nsIStyleSheetService);

    (this.regSheet = (code, origin) => {
        var uri = Services.io.newURI(prfx + encodeURIComponent(code));
        sss.loadAndRegisterSheet(uri, sss[origin]);
    })(...args);
}
}).init("chrome-document-loaded"))(`\
span.%CN%s-container {
    display: inline-flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 2px !important;
    margin-inline: 4px !important;
}

span.%CN%s-container > panel-item {
     display: flex !important;
    flex: none !important;

}

span.%CN%s-container > panel-item::part(button) {
    min-height: 24px !important;
    height: 24px !important;
    padding-block: 0 !important;
    padding-inline-start: 30px !important;
    padding-inline-end: 8px !important;

    overflow: visible !important;
}
span.%CN%s-container > panel-item::part(label) {
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
}

/* оставляем штатное позиционирование label */
span.%CN%s-container > panel-item::part(label) {
    white-space: nowrap !important;
}

span.%CN%s-container > panel-item[data-action="install-update"]::part(button) {
    background-image: url("chrome://global/skin/icons/update-icon.svg") !important;
    background-repeat: no-repeat !important;
    background-position: 8px center !important;
    background-size: 16px !important;
    padding-inline-start: 30px !important;
}
/* Иконки для добавленных кнопок из внутренних ресурсов Firefox */
span.%CN%s-container > panel-item[action="preferences"]::part(button) {
    background-image: url("chrome://global/skin/icons/settings.svg") !important;
}

span.%CN%s-container > panel-item[action="toggle-disabled"]::part(button) {
    background-image: url("chrome://mozapps/skin/extensions/extension.svg") !important;
}
/* Иконки для встроенных кнопок Manage и Options внутри выпадающего меню "..." */
panel-list > panel-item[action="manage"]::part(button),
panel-list > panel-item[action="preferences"]::part(button) {
    background-repeat: no-repeat !important;
    background-position: 8px center !important;
    background-size: 16px !important;
    padding-inline-start: 30px !important;
}

panel-item[data-l10n-id="manage-addon-button"]::part(button) {
    background-image: url("chrome://mozapps/skin/extensions/extension.svg") !important;
}
panel-list > panel-item[action="preferences"]::part(button) {
    background-image: url("chrome://global/skin/icons/settings.svg") !important;
}
`);
