import makeWASocket, { WASocket } from "@adiwajshing/baileys";
import { MenuField } from "../../lib/Types/Menu";
import { MessageMaterial } from "../../lib/Types/ProcessWebMessageTypes";
import * as path from 'path'
import { getDownloadMetadata, getDownloadURL } from "../../lib/scraper/yt2mate"
import * as utils from "../../lib/Utils";


export default async function youtubeDL(sock?: WASocket, m?: MessageMaterial) {
    const _trigger: string[] = ['ytdownload', 'yta', 'ytv', 'ytdl']
    const usingCmd: boolean = !m!.isCommand!
    const _params_require: string[] = ['link yt']
    var _obj: MenuField = {
        module_id: 5,
        name: 'Youtube Downloader',
        description: 'Youtube video/audio and story download',
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
    const args = m!.args
    console.log(args);
    
    if (args.length == 2) {
        const youtubeURL = args[1]
        getDownloadMetadata(youtubeURL)
            .then(async (result: any) => {

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

                await sock?.sendMessage(m?.from!, listMessage)

            }).catch(console.log);
    } else if (args.length > 2 && args[1] == 'convert') {
        const jsonData = JSON.parse(args.slice(2).join(' '));
        const { service, analyze_id, video_id, type, quality, title, thumbnail } = jsonData;
        console.log(jsonData);
        
        getDownloadURL({ service, analyze_id, video_id, type, quality })
            .then(async (dURL) => {
                const downloadURL: any = dURL
                let thumb_caption = `*Downloading* - _${title}_ ...\n\n*Type* : ${type}\n*Quality* : ${quality}`
                const msgDownloading = await m?.replyMessage({ image: { url: thumbnail }, caption: thumb_caption })
                await utils.reactWait(sock!, m!, msgDownloading)

                const fileBuffer: any = await utils.getBuffer(downloadURL)
                if (type == 'mp4') {
                    const sentMsg = await sock?.sendMessage(m?.from!, { video: fileBuffer, fileName: title })
                    await utils.reactRemove(sock!, m!, msgDownloading)
                    await utils.reactSuccess(sock!, m!, sentMsg!)
                } else {
                    const sentMsg = await sock?.sendMessage(m?.from!, { audio: fileBuffer, fileName: title, mimetype: 'audio/mp4'})
                    await utils.reactRemove(sock!, m!, msgDownloading)
                    await utils.reactSuccess(sock!, m!, sentMsg!)
                }
            }).catch(console.log);
    } else {
        m?.replyMessage({ text: 'Format salah / _Invalid Format_ ❌' })
    }

    return _obj
}