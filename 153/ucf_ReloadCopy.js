/**
@UCF @param {"prop":"JsChrome.load","disable":false} @UCF
*/
// ==UserScript==
// @name           ReloadCopy
// @include        main
// ==/UserScript==
(function() {

    let button = document.createXULElement("toolbarbutton");

    button.id = "ReloadCopyURLButton";
    button.setAttribute("class",
        "toolbarbutton-1 chromeclass-toolbar-additional");
    button.setAttribute("label", "Обновить / Копировать URL");
    button.setAttribute("tooltiptext",
        "ЛКМ: обновить страницу\nПКМ: скопировать адрес");

    // Иконка (сюда можно вставить ваш base64)
    button.style.listStyleImage =
        'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+PGltYWdlIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQU1YVWxFUVZSb1ErMVpDWFJOMXhyKzlqbjMzREc1eWMwa2dwTGdpVEVwRVkyeE5LalNDSyttb2xSMTlGb2R0ZnBVdFZTTmJ6MWVIOC9RYXRIUzFsRHptR2VPb2FoWlJCQ1JSSkJKY25QbmUvYjd6NzFvbGNoTnNON3FXdDNMeVpLY3ZmLzlmZi8rOXo4ZGhqLzRZSDl3L1BpVHdQLzdCTy83QkRqblRZOENqeC9JUTh2c3k2WDFpb3VMdzJ6WHkvU0NKTW9CUnYrU3NCQlRidjA2bWxNZGRVajFBM1l3eGk0L1NOSlZJa0NndzFLQlYxY2VLQjF5NUhCRzVJVVRwMUZ3TmcyV0s5bHdsNVdBTyswQUV5Qm9kRkFiZytCZkt4STFHelpDZEpNb3RHblRjUGVydFRDTGlDeDVFRVFxUllDQTY5ZkxtTEJnVGU1YmU3Y2NRczdXRFVCZUpnUzRvSkpFTUZGRnVFVUNyNGpsZ013aHkyN0lMaGRjTGhtUTlOQTBpRUZzcnlRODFibHg3dGdZN2Z0RVpQSDlFUEdaQUlGUEdyN2Z1V2p0a2gzR0t5dVdRckFXUVczUWcwbnFHNEJ2aWlMZ3Q0M2YvSjNJdUcwMk9Ld09vSFkwMnI3eVBGN3VVMi8zSUJQNkU1R2NxaER4aWNBeXpxZE8vYjdvM2YzVC93a2hKeDBhb3hHa2NnS3VLRnJSdEJ1TXRFenE5bUx3bk1DTmQ4cC82VlM0U3VVeEs4ODdXaVBick54dXRqTy9UdDB4ZEdRdi9xOTRYVGNpc2FteUpDb2s4R0VCLzNIeE4yZWZ5Wm85SFZvMTUweW5aMTdnaEVXeGRiY0wzTThFT2J3T2VMVmFrUDBEdlNDVmZ5NGlWcFFQSWU4aTJGVjZiQlp3dFFZZ1UvUE1JY0tPNG1MdURxL0xlbjc2SHA3dXBIMXVPR09MS2tQaW5nUTZuT1BMank0NTBydDR5U3pvQS93NFYwbmUrUzZuQjd3Y1VSK3VadTNnRGdnQXQrVG53bWsrQ0d2WkdiaXNWNkhoZEl2OXE4RVEyQWdxVTB0Qk1nU0xPWmxRSGRrR1ZwclB1WVlVSWRDSjBKREx6Tnl1Q1dEMVB2Z0lRcnl1ZjNvNCs5NVhFdVVTa0RieUwzRGk3QWkrZkFiVS9rYk9CZEV6bHprc25PdU16Tm02RDF4a1JjZzV0UUNIbHMvQjdxWDc3N0dwQ29PbWRVU0Q5bTh3VTYwZVV1WXBxQTZ2QXhkVkhLTGFpOEZXeGgzNklNYWZlUXR5SFVNY09yRkR2cEM0TzRFMWZLQ1FXN0JZdlhZNkJMV09jNUhPbSt5V09jeGNydDZRMlI5TkJqK3pZejMra2Z3YWJYTFJsNDF1elVtZUVJK0UzbCtKQmxOanphNHZBYWVWVGxicnZUVldNM2RITkdEMmxuMEw4WVNoQmlLWnJTTFpkeEpZeGF1eHZJSTgzZEVsWUNTUUxwOXk2d2k4amJ0cnhUQmIrR05BeXJ5UldEbG1aa1hDNy9sK3pKNjVRbFRNaTlvRDh6eXl1YWhvU1NGUkFtZE1MempDbTMrSndXeDRSWHZjU1dDKzZ5ZHQ4ZDZlVXVZZXp0VmEwanlaamR2QjNhRi9ZWllBQXIvaTR6N1lQbWRaUllKOWV2L09yc2xpazVoUnV1UHpQVEdEQWducHl1M3hFSmJHd3lBYlRFM3dMRHQ1TDFtM0U1alBIeFdSZjlndjgxdHdSUmlGS01abExwUE5tME43Z2kvK2ZBaDJUbDdvRXpoZkovMzk0QSthcU5BKzJ2TS9nQXM2NVphUndxeHdocldBMjcvZE92c0xxaDYrRTVodFgrWFA5aVZKaFVkSW1KWVVJWk9qY0tLMCtnQTQxcSthamFYREZadC8wRVBFWjJldkJnU2REeEpMTXppWEZaT2xlRUkvYmNHOTBhWjJXTzJ0blZsV2VaditlZ0xUZUlpa3o3NFdUTEdFay8vbXBIMEJkamlNelZCNFdsT0FTYTFDUFdmN01FYS9GYjAxM2RvdUR5cGJRYUZCY2ExMEN0d0dtK2x4aEttYWZKSStnSTJya0VESXQvd2xwajQ3eDY5c0s1a2pCUnVGZ3NTUjUzb2ExbmxmRGNXZUQ3OTVHTmh2eVJ5WGZxNW13OHdvbGZVOE9UekZQMVArcEExSGhESHh4TS9kRFUwckpOQjJzMzExam1YUDAycGJ1a2VBd0VpQTdoR2NTdzB0NXBQamdoNmE5bThpZTIzL3FHb2RneVlIOFJTNDNRb0JEZ2VsSHZXRE8yTnpZczB3U2pPdTNZM0VMUlBxc2U1YWRvYnp2elhVN3V1MFZvUktkS0JRYUlQTTVWbGZZV0dQRng2cTloWGhjYk1hQkF6dmtoWlZZemRrQjZVbm5NRUJKNkpDdW1CQ204ak96U1cydFZ3Q2xHa0dkMXQxTGo5UDJBVU5KV2FLb2F2VUhCZUxIa2ZPdkpUKzJQNkt6Nkg5Zm9qNlQwNjcxakQyWkloZ0t5QXpGdUVtQ3FiQXRuaStUcFBYQjlaaFg1UkxZRk1wYnpKNXovbmpOcjRkS2lXRlVaTUpxVlZJT3gyTDNFbnpZM0JoMnJIN0FlYnIydUJKcC9kRkoxeHVKZGt6NGFJOEVhSUwrckRXYU8zWGVQeTRhRGEyWEFJZm5lVUoyN012cHFxRTNWUk5BWmFzSEtnb1FTc3M2NEMwbDZmWGduVit0cThnS2p1UFRqOWNPWEI2NUxnbHR1K0YwTlMyT3VzWlNLWlFjRWNwQ2k0RklEYTY5NEt2VzJFTXpWRmNsSVB1dzlXYiszanV3Qk5FSUczaDhsVHo2ci9EVGZabnpqaFA1YUFlQ1pOWG9iRXhJbUx1NEVZUHRJNVY5a3o4b1RBZ3dsV3l3WG81UGNGU1J2ZE9wY1hlTTlmNDllM2ptV2d0UmxEOG83QmZ5VVBSNFF1b09XdzJtdGNOaHR0dVEyQmdJQXgxbW0xTlRBcEw2c3VZMVVPZ1ppcHZXalI3L3JHeVJTOUNsS2dzcE1kbGM2TDcxTFhvbTl5MHdaQzZOZE1ycTltSzVqZFp4dVBPSHp6OHMyVlNDNi8rVlJvSTNFN2VUNkw3cTJLeXcrRXBUMFd0eUowT0crR2t5ayt4SzhvMFRCOGZROWVoVFNPWFJySk1ENEZxR1R5c2RNcXFLNjd2QmxNNjRpMFI3ZVlTZEJpOUdHKy8wNnRMejBCcFMwV0FLdjIreFJ3SjdSSjJpUmxyVzZrMmZBZ3FPTWptbFNyUFd5TjRZK2JOeW80aXM5dk91YVdVdVpKbVFvN3V0eG9UdzVJSkova3F6MXpPOUc4ZnlITXU2QjhHaDlranlGMWFpS0JlWTlGNzlGdGo1OGJyeGxjYW9DOEw2cjJ1UWE5Mzl3bkhsOFNxTmhJSlF5alZIZDdzOTlkQlVWbDJFdmdDNXVveEE3emxpNXN3VnZQa2JYZEErVVVhazd0RitQSGxSQ0gzRnlyN0RFcnVEMGVOeHhEVWQvS2hhNS9XaS9NRlQ5WG1iRk5oVk5SKzFjbWZta3RiUHdiWEIxTUtvSkR3RHVaMmN0aUttTDNyRk1qTm50Mkk4WVp1djkzbjFrVGhjLzZldEczcUZISC9IRUJIZFMybHRkeE5ucmpuTEZSUGFGay9lN2cybzJvQWZWb2w0dDBMZTZYMExTM1YyeWFBNjB4a0JXVEtsTVl6MjNWbVN4d1BkK09lNnpIZTJQMzMwbjVONXI3bFVkS1c3ZWMwNjBaUkI0RnlJYkpGV2d4SHpFQTRXdlJkaW1sMUJ2Z0VwZXFUQkx4NUlWWEtQdGhLay9LcDRwVTRlUkptNnpRR3J2cGQxbUNTS2VsdW9tK3JCOWpiMmZ0MW16K0xGL0tPa3hucHlUTzdLQ3VrdU5CakdoVVhxampNYk9aVG5WcDFEblJyM3ppM1c4bzUxbHF6YlJMc0hkNkRzMzdpVDVnUzJLczhtYmNYTkJONWt2VExsbFhhclorQmE4a3JrRGRpOWxMdXJ0R1NXZHNOeStQL252NElNSmRDM1VNZVF3OXNaYnFRSnpqYzMyRjIvWUgzMnUzT2tuSkUxaW0vSGJNYWlsZE9Va2xwOEhxRXNtSnViL0VjcTV2ODFLNVRyNXZhUHdqNEZJRTkvcEtpNm8xdTJPK2tEdDdiRUlzU1RsZTAxNTBFUHVJSnFxd1RxZjRwRTZrcUU3MXVqUzYwaytKQ1NQZS9ZY1FyYlZOSEpXaTcwc2JrYjZzMkNIemcrTlZYRGxyMGZwYlBFdzJ4NVpMd1FmemQyeXJ2RkgyaFA3ZC9oTzdJMTVBMS9pU0dsTVhkM0hyOU9ndHAwdy9EaG5RcStDVEpOSWcyM3VqREhyZE55U3JqeVo4c3ZieHc2ZUtOL2pwL0E1Skg5RG8wcjR1VVFMS3FaSnJsTnJidzBxVmp4b3NwVFRXWHRuRzMycC9tS1IxRnptMGwxeUdITm1LZC8vb01laVpVVHhuVzFqQ0pOcjlycm40VE9XbGNsVzlCdC8vc3lIOS93OTZyYlE1dVdBbHQ4Um51ZHNuTS83Ris2RExveVJQZmRKZGFrUnhMWlJWU1BvRVB1SW5sWjZRSDV1ME9VZWZ2Z3l6NlVhZkMyeGFWSFZaT2ZWa1dFQm1IRm5HeGFCb1ZtQnNkWWR4Uk8xaDlPTnpBczlRUWJIYVo2UzhVT3lMUDVUdml6bVFXZFRpV1ZScDg2c2doMkhPUFFxOFJPSk9vWlVQM3kxNVNqSUJtWFZFbnJ2M2xhMVpyNjdUUmtabVZJVkUrQVVYS09CN0JzaTRjRHJRZHJhWXIyZ21aYWFnL3A3UVlsYjNkY0Ruc3NMbW94V2tJaFRHa0pnSk5JVERvOVJESjRoejBQY0JzdHVBNk5YZk5oWmNvcGhSQVM5ZEprSlFZNDkyV2Vjb1dLeXZSeHFGVUhjUDlkTVltNWdXMVR6MDRBb3FrbDNnQTdObWIvVFY1OFFIV3pSUWRMWFFibEg2bTRrVElReEVscm56RVVIci95Z2VORyttVmdsR2c5NkpBb0QzZDZKc2ZQaFNoTXFuQlFkMDRIU3ZSZFVacFdjQnhXQzRtWW1YWFczbStyeVR1ZlFLL2xUSWdlNkphVnpMYTVKY09MVThqMEM0Q3JYVFNibWFQRlhscnBmTkdhWTVBd1pIU1pCdUxScEc1QVJ3bHdrd3NpeDdwSytEZnovT2RnTEt5WjE1VGFNMHpkSUdXamtaVERyVFNSY3JoeStnUWxGTlF6T3BHY3VzeGp4dURRRE9CSGpvU21SbGdjOVpHU1ZFRXJJWENYaFNxUnlLbHdjOVZCZTgxdzZxTTVNdnhZTVZ2U2daenNpNEVPcTJ4RkdwTkNVVFJRa0FWYjZpa3cyUkExSjV4dVhWdzJvMndsZmpEZWcwT1o1bDZEYXlZZ1UweHU2cXk5ZjJkd0IwN2NoMFMwOXBENitwQVQ2d2d1UjVSQ3k0VFU4a1Nkek9YdzZrcWtsM2lKVmpGb3pBTE83Q3pZQ2ZRc2NvQjhHNkVxM1lDRmFwT3VSamxwQWdWcnEzY2hJZEVvSElnN21mMm53VHVSM3NQWXUzL0FLSE4vbTNlQk9nK0FBQUFBRWxGVGtTdVFtQ0MiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIvPjwvc3ZnPg==")';


    // Левая кнопка - обновление
    button.addEventListener("click", function(e) {

        if (e.button == 0) {

            if (gURLBar.focused) {

                let str = gURLBar.value;

                let tab = gBrowser.addTab(str);
                gBrowser.selectedTab = tab;

                handleURLBarCommand();

            } else {

                BrowserCommands.reload();

            }
        }

    });


    // Правая кнопка - копирование URL
    button.addEventListener("contextmenu", function(e) {

        if (!e.ctrlKey &&
            !e.shiftKey &&
            !e.altKey &&
            !e.metaKey) {

            e.preventDefault();

            let url = gURLBar.value;

            navigator.clipboard.writeText(url);


            let oldValue = gURLBar.value;
            let msg = "   Адрес скопирован в буфер !";

            let i = 0;

            function showMessage() {

                if (i++ < msg.length) {
                    gURLBar.value = msg.substring(1, i);
                    setTimeout(showMessage, 10);
                }

            }

            showMessage();


            setTimeout(function() {
                gURLBar.value = oldValue;
            }, 1500);

        }

    });


    // вставляем рядом с кнопками адресной строки
    let urlbar = document.getElementById("page-action-buttons");

    if (urlbar) {
        urlbar.insertBefore(button, urlbar.firstChild);
    }


})();