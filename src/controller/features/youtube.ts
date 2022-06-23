import makeWASocket, { WASocket } from "@adiwajshing/baileys";
import { MenuField } from "../../lib/Types/Menu";
import { MessageMaterial } from "../../lib/Types/ProcessWebMessageTypes";
import * as path from 'path'
import * as utils from "../../lib/Utils";


export default function youtube(sock?: WASocket, m?: MessageMaterial) {
    const _trigger: string[] = ['youtube', 'yta', 'ytv', 'yt']
    const usingCmd: boolean = !m!.isCommand!
    const _params_require: string[] = ['link yt'] 
    var _obj: MenuField = {
        module_id: 2,
        name: 'Youtube Downloader',
        description: 'Youtube video/audio and story download',
        required: JSON.stringify(_params_require),
        modulePath: path.basename(__filename),
        featureStatus: 'maintenance',
        triggerMsg: _trigger.join('|'),
    }
    _obj = {..._obj, responseJSON: JSON.stringify(_obj) }
    if (usingCmd) return _obj
    if (!_trigger.includes(m!.command!)) return _obj
    // Place your code here

    sock

    return _obj
}