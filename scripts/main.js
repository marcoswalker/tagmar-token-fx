Hooks.on('tagmar_itemRoll', async function (rollItem, user) {
    if (game.user !== user) return;
    const magicFlags = rollItem.getFlag('tagmar-token-fx', 'magicFx');
    if (magicFlags) {
        for (let magic of magicFlags) {
            let pstParams = {
                name: magic,
                library: "tmfx-template"
            };
            if (TokenMagic.getPreset(pstParams)) await TokenMagic.addUpdateFiltersOnSelected(TokenMagic.getPreset(pstParams), false);
        }
    }
});

Hooks.on("renderActorSheet", function (sheet, html, character) {
    if (character.actor.type !== "Personagem") return;
    $(html.find(".searchMagia")).css('width','90%');
    $("<a class='removeFX' style='margin-left:20px;' title='Remover Efeitos Mágicos'><i class='fas fa-hand-sparkles'></i></a>").insertAfter(html.find('.searchMagia'));
    $(html.find(".searchCombate")).css('width','90%');
    $("<a class='removeFX' style='margin-left:20px;' title='Remover Efeitos Mágicos'><i class='fas fa-hand-sparkles'></i></a>").insertAfter(html.find('.searchCombate'));
    html.find('.removeFX').click(function (event) {
        TokenMagic.deleteFiltersOnSelected();
    });
});

Hooks.on('ready', function () {
    if (!(game.system.id === "tagmar_rpg" || game.system.id === "tagmar")) return ui.notifications.error("Esse módulo só funciona com o sistema Tagmar, não insista.");
});

Hooks.on("renderItemSheet", function (itemSheet, html, data) {
    if (!(game.system.id === "tagmar_rpg" || game.system.id === "tagmar")) return ui.notifications.error("O módulo Token Magix Fx -> Efeitos Mágicos Tagmar, só funciona com o sistema Tagmar.");
    if (!game.modules.get('tokenmagic')) return;
    let tmfxTemplatePresets = TokenMagic.getPresets("tmfx-template");
    if (itemSheet.item.type === "Magia" && itemSheet.item.actor !== null) {
        $.get("/modules/tagmar-token-fx/templates/magia.hbs", function (data) {
            html.find('.abas').first().removeClass('esconde');
            html.find('.sheet-primary .container_dados').first().append(data);
            for (let efect of tmfxTemplatePresets) {
                html.find('.magia_fx').append("<option class='mediaeval' value='"+ efect.name +"'>"+ efect.name + "</option>");
            }
            html.find(".addMagicFx").click(function (event) {
                const magicEfect = html.find(".magia_fx").val();
                let ImagicFlags = itemSheet.item.getFlag('tagmar-token-fx', 'magicFx');
                if (typeof ImagicFlags === "undefined" || typeof ImagicFlags === "string") {
                    ImagicFlags = [magicEfect];
                } else {
                    ImagicFlags.push(magicEfect);
                }
                itemSheet.item.setFlag('tagmar-token-fx', 'magicFx', ImagicFlags);
                event.preventDefault();
            });
            const magicFlags = itemSheet.item.getFlag('tagmar-token-fx', 'magicFx');
            if (magicFlags) {
                for (let magic of magicFlags) {
                    html.find('.table_fx').append("<tr style='text-align:center;'><td>" + magic + "</td><td><a class='removeMagic' data-item-id='"+magic+"'><i class='fas fa-hand-sparkles'></i></a></td></tr>");
                }
            }
            html.find('.removeMagic').click(function (event) {
                let magicF = itemSheet.item.getFlag('tagmar-token-fx', 'magicFx');
                let indexM = magicF.indexOf($(event.currentTarget).data("itemId"));
                if (indexM !== -1) {
                    magicF.splice(indexM, 1);
                    itemSheet.item.setFlag('tagmar-token-fx', 'magicFx', magicF);
                }
                event.preventDefault();
            });
            itemSheet.activateTab('basico');
        });
    } else if (itemSheet.item.type === "Tecnica_Combate" && itemSheet.item.actor !== null) {
        $.get('/modules/tagmar-token-fx/templates/tecnica.hbs', function (data) {
            html.find('.abas').first().removeClass('esconde');
            html.find('.sheet-primary .container_dados').first().append(data);
            for (let efect of tmfxTemplatePresets) {
                html.find('.magia_fx').append("<option class='mediaeval' value='"+ efect.name +"'>"+ efect.name + "</option>");
            }
            html.find(".addMagicFx").click(function () {
                const magicEfect = html.find(".magia_fx").val();
                let ImagicFlags = itemSheet.item.getFlag('tagmar-token-fx', 'magicFx');
                if (typeof ImagicFlags === "undefined" || typeof ImagicFlags === "string") {
                    ImagicFlags = [magicEfect];
                } else {
                    ImagicFlags.push(magicEfect);
                }
                itemSheet.item.setFlag('tagmar-token-fx', 'magicFx', ImagicFlags);
            });
            const magicFlags = itemSheet.item.getFlag('tagmar-token-fx', 'magicFx');
            if (magicFlags) {
                for (let magic of magicFlags) {
                    html.find('.table_fx').append("<tr style='text-align:center;'><td>" + magic + "</td><td><a class='removeMagic' data-item-id='"+magic+"'><i class='fas fa-hand-sparkles'></i></a></td></tr>");
                }
            }
            html.find('.removeMagic').click(function (event) {
                let magicF = itemSheet.item.getFlag('tagmar-token-fx', 'magicFx');
                let indexM = magicF.indexOf($(event.currentTarget).data("itemId"));
                if (indexM !== -1) {
                    magicF.splice(indexM, 1);
                    itemSheet.item.setFlag('tagmar-token-fx', 'magicFx', magicF);
                }
            });
            itemSheet.activateTab('basico');
        });
    }
});