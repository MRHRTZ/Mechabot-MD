import { AnyWASocket } from "@adiwajshing/baileys";
import { MenuField } from "../../lib/Types/Menu";
import { MessageMaterial } from "../../lib/Types/ProcessWebMessageTypes";
import * as path from 'path'
import * as utils from "../../lib/Utils";


export default function instagram(sock?: AnyWASocket, m?: MessageMaterial) {
    const _trigger: string[] = ['instagram', 'ig', 'insta', 'igstory', 'reels']
    const usingCmd: boolean = !m!.isCommand! 
    const _params_require: string[] = ['link insta'] 
    var _obj: MenuField = {
        module_id: 1,
        name: 'Instagram Downloader',
        description: 'All instagram downloader, post, reels, and story, etc.',
        required: JSON.stringify(_params_require),
        modulePath: path.basename(__filename),
        featureStatus: 'maintenance',
        triggerMsg: _trigger.join('|'),
    }
    _obj = {..._obj, responseJSON: JSON.stringify(_obj) }
    if (usingCmd) return _obj
    if (!_trigger.includes(m!.command!)) return _obj
    // Place your code here

    sock?.sendMessage(m?.from!, { text: 'Blm ada' })
        

    return _obj
}