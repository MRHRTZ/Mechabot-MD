import makeWASocket, { WASocket } from "@adiwajshing/baileys";
import { MenuField } from "../../lib/Types/Menu";
import { MessageMaterial } from "../../lib/Types/ProcessWebMessageTypes";
import * as path from 'path'
import * as utils from "../../lib/Utils";
import { InputField } from "../../lib/Types/Input";
import Input from "../../models/Input";
import { GetData, nextPage } from "../../lib/scraper/youtubeSearch";


export default async function youtubeSearch(sock?: WASocket, m?: MessageMaterial, input?: InputField) {
    const _trigger: string[] = ['ytsearch']
    const usingCmd: boolean = !m!.isCommand!
    const _params_require: string[] = ['']
    var _obj: MenuField = {
        module_id: 4,
        name: 'Youtube Search',
        description: 'Youtube video/audio Search',
        required: JSON.stringify(_params_require),
        modulePath: path.basename(__filename),
        featureStatus: 'active',
        triggerMsg: _trigger.join('|'),
    }
    _obj = { ..._obj, responseJSON: JSON.stringify(_obj) }
    if (m!.fromMe) return _obj
    if (_obj.featureStatus != 'active' && !m?.isOwner) return _obj
    const userInput = new Input()
    if (input && usingCmd) {
        const waitMsg = await utils.waitMessage(sock!, m!, "Sedang mencari data video / _Searching video data_ ...")
        userInput.update({ jid: `${m?.from}_${m?.sender}`, feature: path.basename(__filename) + utils.timeTags(8), is_input: "T", value: m?.body! }).catch(console.log);
        GetData(m?.body!, false, 15)
            .then(async (data) => {
                let page = 1
                let sections: any = [
                    {
                        title: "Page " + page,
                        rows: []
                    }
                ]
                data.items.filter(v => !v.isLive && v.type == 'video').forEach((item) => {
                    sections[0].rows.push({
                        title: item.channelTitle,
                        rowId: ".ytdownload https://www.youtube.com/watch?v=" + item.id,
                        description: item.title + " || " + item.length.accessibility.accessibilityData.label
                    })
                })
                let nextPageCount = page + 1
                sections[0].rows.push({
                    title: "Next Page ⏩",
                    rowId: ".ytsearch n3x7p4g3 " + nextPageCount + " " + m?.body! + " " + JSON.stringify(data.nextPage),
                    description: "Go to page " + nextPageCount
                })

                const listMessage = {
                    text: "YT Search and download.",
                    footer: "follow my github : https://github.com/MRHRTZ",
                    title: "Youtube Search - " + m?.body!,
                    buttonText: "Select Video...",
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
    if (m?.args[1] == "n3x7p4g3") {
        let nextPageInt = Number(m?.args[2])
        const waitMsg = await utils.waitMessage(sock!, m!, `Sedang mencari data video di halaman ${nextPageInt} / _Looking for video data on page ${nextPageInt}_ ...`)
        const query = m?.args[3]
        const nextPageObj = JSON.parse(m?.args[4])
        userInput.update({ jid: `${m?.from}_${m?.sender}`, feature: path.basename(__filename) + utils.timeTags(8), is_input: "T", value: m?.body! })
        nextPage(nextPageObj, false, 15)
            .then(async (data) => {
                let sections: any = [
                    {
                        title: "Page " + nextPageInt,
                        rows: []
                    }
                ]
                data.items.filter(v => !v.isLive && v.type == 'video').forEach((item) => {
                    sections[0].rows.push({
                        title: item.channelTitle,
                        rowId: ".ytdownload https://www.youtube.com/watch?v=" + item.id,
                        description: item.title + " || " + item.length.accessibility.accessibilityData.label
                    })
                })
                let nextPageCount = nextPageInt + 1
                sections[0].rows.push({
                    title: "Next Page ⏩",
                    rowId: ".ytsearch n3x7p4g3 " + nextPageCount + " " + query + " " + JSON.stringify(data.nextPage),
                    description: "Go to page " + nextPageCount
                })

                const listMessage = {
                    text: "YT Search and download.",
                    footer: "follow my github : https://github.com/MRHRTZ",
                    title: "Youtube Search - " + query,
                    buttonText: "Select Video...",
                    sections
                }

                const sentMsg = await sock?.sendMessage(m?.from!, listMessage)
                await utils.reactRemove(sock!, m!, waitMsg)
                await utils.reactSuccess(sock!, m!, sentMsg!)
            }).catch(e => {
                utils.reactFailed(sock!, m!, waitMsg)
                utils.logger(e, "error")
            })
    } else if (!input && m?.args[1] != "n3x7p4g3") {
        userInput.new({ jid: `${m?.from}_${m?.sender}`, feature: path.basename(__filename), input_type: 'keyword', is_input: 'F' })
        m?.replyMessage({ text: 'Masukan kata kunci pencarian / _Enter your search term_ ...' })
    }

    return _obj
}