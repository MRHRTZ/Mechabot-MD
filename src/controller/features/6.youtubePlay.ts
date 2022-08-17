import makeWASocket, { WASocket } from "@adiwajshing/baileys";
import { MenuField } from "../../lib/Types/Menu";
import { MessageMaterial } from "../../lib/Types/ProcessWebMessageTypes";
import * as path from 'path'
import * as utils from "../../lib/Utils";
import { InputField } from "../../lib/Types/Input";
import Input from "../../models/Input";
import { GetData, nextPage } from "../../lib/scraper/youtubeSearch";
import { getDownloadMetadata } from "../../lib/scraper/yt2mate";


export default async function youtubePlay(sock?: WASocket, m?: MessageMaterial, input?: InputField) {
    const _trigger: string[] = ['ytplay', 'play']
    const usingCmd: boolean = !m!.isCommand!
    const _params_require: string[] = ['query']
    var _obj: MenuField = {
        module_id: 6,
        name: 'Youtube Play',
        description: 'Play Music from YouTube',
        required: JSON.stringify(_params_require),
        modulePath: path.basename(__filename),
        featureStatus: 'active',
        triggerMsg: _trigger.join('|'),
    }
    _obj = { ..._obj, responseJSON: JSON.stringify(_obj) }
    if (_obj.featureStatus != 'active' && !m?.isOwner) return _obj
    if (m!.fromMe) return _obj
    const userInput = new Input()
    if ((m?.args?.length! > 1 && m?.isCommand || input && !m?.isCommand) && m?.args[1] != 'convert') {
        const waitMsg = await utils.waitMessage(sock!, m!, "Sedang mencari data video / _Searching video data_ ...")
        userInput.update({ jid: `${m?.from}_${m?.sender}`, feature: path.basename(__filename) + utils.timeTags(8), is_input: "T", value: m?.body! }).catch(console.log);
        let query: string | undefined = ''
        if (input) {
            query = m?.body!
        } else {
            query = m?.args.slice(1).join(' ')
        }
        GetData(query, false, 15)
            .then(async (data) => {
                const youtubeURL = "https://www.youtube.com/watch?v=" + data.items.filter(v => !v.isLive && v.type == 'video')[0]['id']
                let result: any = await getDownloadMetadata(youtubeURL)
                result.resolution = result.resolution.filter(v => v.type != '3gp')

                let sections: any = [
                    {
                        title: '',
                        rows: []
                    }
                ]
                
                result.resolution.forEach(res => {
                    let jsonObj = result
                    delete jsonObj.resolution
                    jsonObj.type = res.type
                    jsonObj.size = res.size
                    jsonObj.quality = res.quality
                    let jsonString = JSON.stringify(jsonObj)

                    sections[0].rows.push({
                        title: res.quality,
                        rowId: `.ytdownload convert ${jsonString}`,
                        description: `Type : ${res.type} || Size : ${res.size}`
                    })
                });

                const listMessage = {
                    text: result.title,
                    footer: "follow my github : https://github.com/MRHRTZ",
                    title: "Youtube Download #" + result.video_id,
                    buttonText: "Select Resolution ...",
                    sections
                }
                const sentMsg = await sock?.sendMessage(m?.from!, listMessage)
                await utils.reactRemove(sock!, m!, waitMsg)
                await utils.reactSuccess(sock!, m!, sentMsg!)
            }).catch(e => {
                utils.reactFailed(sock!, m!, waitMsg)
                utils.logger(e, "error")
            })
    }
    if (usingCmd) return _obj
    if (!_trigger.includes(m!.command!)) return _obj
    // Place your code here
    if (!input && m?.args.length == 1) {
        userInput.new({ jid: `${m?.from}_${m?.sender}`, feature: path.basename(__filename), input_type: 'keyword', is_input: 'F' })
        m?.replyMessage({ text: 'Masukan kata kunci pencarian / _Enter your search term_ ...' })
    }

    return _obj
}