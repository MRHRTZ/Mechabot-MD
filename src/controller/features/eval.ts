import { WASocket } from "@adiwajshing/baileys";
import { MenuField } from "../../lib/Types/Menu";
import { MessageMaterial } from "../../lib/Types/ProcessWebMessageTypes";
import * as path from 'path'
import * as utils from "../../lib/Utils";
import { exec } from 'child_process'
import * as util from 'util'

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
    // if (usingCmd) return _obj
    // if (!_trigger.includes(m!.command!)) return _obj
    // Place your code here
    if (
        m?.body?.startsWith(">> ") &&
        m.isOwner
    ) {
        exec(m.body.slice(3), (err, stdout, stderr) => {
            if (err) {
                sock?.sendMessage(m?.from!, { text: util.format(err) });
                return;
            }
            sock?.sendMessage(m?.from!, { text: util.format(stdout.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "")) });
        });
    } else if (
        m?.body!.startsWith(">>> ") &&
        m?.isOwner
    ) {
        try {
            const datainput = m?.body!.slice(4);
            sock?.sendMessage(m?.from!, { text: util.format(eval(datainput)) });
        } catch (error) {
            sock?.sendMessage(m?.from!, { text: util.format(`*Error unexpected* :\n\n${error}`) });
        }
    }



    return _obj
}
