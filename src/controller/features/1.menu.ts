import { WASocket } from "@adiwajshing/baileys";
import { MenuField } from "../../lib/Types/Menu";
import { MessageMaterial } from "../../lib/Types/ProcessWebMessageTypes";
import * as path from 'path'
import * as utils from "../../lib/Utils";
import { exec } from 'child_process'
import * as util from 'util'
import Menu from "../../models/Menu";

export default async function menu(sock?: WASocket, m?: MessageMaterial) {
    const _trigger: string[] = ['menu']
    const usingCmd: boolean = !m!.isCommand!
    const _params_require: string[] = ['']
    var _obj: MenuField = {
        module_id: 1,
        name: 'Menu',
        description: 'Show all menu items in Mechabot',
        required: JSON.stringify(_params_require),
        modulePath: path.basename(__filename),
        featureStatus: 'active',
        triggerMsg: _trigger.join('|'),
    }
    _obj = { ..._obj, responseJSON: JSON.stringify(_obj) }
    if (_obj.featureStatus != 'active' && !m?.isOwner) return _obj
    if (usingCmd) return _obj
    if (!_trigger.includes(m!.command!)) return _obj
    // Place your code here

    const listMessage: any = {
        text: "Hi ...",
        footer: "follow my github : https://github.com/MRHRTZ",
        title: "Mechabot temporary menu",
        buttonText: "Select Menu",
        sections: [
            {
                rows: []
            },
        ]
    }

    const menu = new Menu()
    const menuList = await menu.queryList()
    menuList.filter(v => v.featureStatus == 'active').forEach(menuItem => {
        listMessage.sections[0].rows.push({
            title: menuItem.name,
            description: menuItem.description,
            rowId: `.${menuItem.triggerMsg?.split("|")[0]}`
        })
    })

    sock?.sendMessage(m?.from!, listMessage)


    return _obj
}