import { proto, AnyWASocket, MessageUpdateType, getContentType, jidDecode, downloadMediaMessage, isJidUser, AnyMessageContent, MessageType } from '@adiwajshing/baileys'
import { MessageMaterial } from '../lib/Types/types'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

export default function processMessage(conn: AnyWASocket, m: { messages: proto.IWebMessageInfo[], type: MessageUpdateType }) {
    const msg: proto.IWebMessageInfo = m.messages[0]
    if (!msg.message) return
    console.log(JSON.stringify(msg, null, 2))

    let sender = isJidUser(msg.key.remoteJid!) ? msg.key.remoteJid : (msg.key.remoteJid?.includes('g.us') ? (msg.key.participant || msg.participant) : msg.key.remoteJid)
    let type = getContentType(msg.message!) ?? Object.keys(msg.message!)[0]
    let quotedType = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ? (getContentType(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage!) ?? Object.keys(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage!)[0]) : ''
    let body = String(type) != 'viewOnceMessage' || String(type) != 'ephemeralMessage' ? (
        type == 'conversation' ? msg.message?.conversation :
            type == 'extendedTextMessage' ? msg.message?.extendedTextMessage?.text :
                type == 'imageMessage' ? msg.message?.imageMessage?.caption :
                    type == 'videoMessage' ? msg.message?.videoMessage?.caption :
                        type == 'buttonsMessage' ? msg.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.buttonsResponseMessage?.selectedDisplayText :
                            type == 'listResponseMessage' ? msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId : ''
    ) : String(type) == 'viewOnceMessage' ? (
        type == 'conversation' ? msg.message?.viewOnceMessage?.message?.conversation :
            type == 'extendedTextMessage' ? msg.message?.viewOnceMessage?.message?.extendedTextMessage?.text :
                type == 'imageMessage' ? msg.message?.viewOnceMessage?.message?.imageMessage?.caption :
                    type == 'videoMessage' ? msg.message?.viewOnceMessage?.message?.videoMessage?.caption :
                        type == 'buttonsMessage' ? msg.message?.viewOnceMessage?.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.viewOnceMessage?.message?.buttonsResponseMessage?.selectedDisplayText :
                            type == 'listResponseMessage' ? msg.message?.viewOnceMessage?.message?.listResponseMessage?.singleSelectReply?.selectedRowId : ''
    ) : String(type) == 'ephemeralMessage' ? (
        type == 'conversation' ? msg.message?.ephemeralMessage?.message?.conversation :
            type == 'extendedTextMessage' ? msg.message?.ephemeralMessage?.message?.extendedTextMessage?.text :
                type == 'imageMessage' ? msg.message?.ephemeralMessage?.message?.imageMessage?.caption :
                    type == 'videoMessage' ? msg.message?.ephemeralMessage?.message?.videoMessage?.caption :
                        type == 'buttonsMessage' ? msg.message?.ephemeralMessage?.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.ephemeralMessage?.message?.buttonsResponseMessage?.selectedDisplayText :
                            type == 'listResponseMessage' ? msg.message?.ephemeralMessage?.message?.listResponseMessage?.singleSelectReply?.selectedRowId : ''
    ) : ''
    let cmd = body?.toLowerCase().split(" ")[0] || "";
    let prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/.test(cmd) ? cmd.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/gi) : "";

    var obj: MessageMaterial = {
        from: msg.key.remoteJid,
        pushname: msg.pushName,
        fromMe: msg.key.fromMe,
        sender: jidDecode(sender!).user,
        type,
        isOwner: process.env.owner_jid!.split(',').includes(jidDecode(sender!).user),
        args: body?.split(/ +/g) ?? [],
        command: prefix! + cmd!,
        body,
        mentions: msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? [],
        isMedia: (type == 'imageMessage') || (type == 'videoMessage') || (type == 'audioMessage') || (type == 'stickerMessage') || (type == 'documentMessage'),
        getBuffer: async () => await downloadMediaMessage(msg, 'buffer', {}),
        replyMessage: async (messageContent: AnyMessageContent) => await conn.sendMessage(msg.key.remoteJid!, messageContent, { quoted: msg }),
        quoted: {
            isMedia: (quotedType == 'imageMessage') || (quotedType == 'videoMessage') || (quotedType == 'audioMessage') || (quotedType == 'stickerMessage') || (quotedType == 'documentMessage'),
            isQuoted: msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ? true : false,
            type: quotedType as MessageType,
            body: String(type) != 'viewOnceMessage' || String(type) != 'ephemeralMessage' ? (
                type == 'conversation' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation :
                    type == 'extendedTextMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text :
                        type == 'imageMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption :
                            type == 'videoMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.caption :
                                type == 'buttonsMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.buttonsResponseMessage?.selectedDisplayText :
                                    type == 'listResponseMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.listResponseMessage?.singleSelectReply?.selectedRowId : ''
            ) : String(type) == 'viewOnceMessage' ? (
                type == 'conversation' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.conversation :
                    type == 'extendedTextMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.extendedTextMessage?.text :
                        type == 'imageMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.imageMessage?.caption :
                            type == 'videoMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.videoMessage?.caption :
                                type == 'buttonsMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.buttonsResponseMessage?.selectedDisplayText :
                                    type == 'listResponseMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.listResponseMessage?.singleSelectReply?.selectedRowId : ''
            ) : String(type) == 'ephemeralMessage' ? (
                type == 'conversation' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.conversation :
                    type == 'extendedTextMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.extendedTextMessage?.text :
                        type == 'imageMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.imageMessage?.caption :
                            type == 'videoMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.videoMessage?.caption :
                                type == 'buttonsMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.buttonsResponseMessage?.selectedDisplayText :
                                    type == 'listResponseMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.listResponseMessage?.singleSelectReply?.selectedRowId : ''
            ) : '',
            getBuffer: async () => await downloadMediaMessage(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage as proto.IWebMessageInfo, 'buffer', {})
        }
    }

    return obj
}