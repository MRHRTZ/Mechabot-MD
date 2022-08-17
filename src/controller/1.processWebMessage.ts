import { proto, WASocket, MessageUpsertType, getContentType, jidDecode, downloadMediaMessage, isJidUser, AnyMessageContent, MessageType } from '@adiwajshing/baileys'
import { MessageMaterial } from '../lib/Types/ProcessWebMessageTypes'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

export default function processMessage(conn: WASocket, m: { messages: proto.IWebMessageInfo[], type: MessageUpsertType }) {
    const msg: proto.IWebMessageInfo = m.messages[0]
    if (!msg.message) return

    let sender = isJidUser(msg.key.remoteJid!) ? msg.key.remoteJid : (msg.key.remoteJid?.includes('g.us') ? (msg.key.participant || msg.participant) : msg.key.remoteJid)
    let type: any = getContentType(msg.message!) ?? Object.keys(msg.message!)[0]
    let quotedType = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ? (getContentType(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage!) ?? Object.keys(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage!)[0]) : ''
    let body = String(type) != 'viewOnceMessage' || String(type) != 'ephemeralMessage' ? (
        type == 'conversation' ? msg.message?.conversation :
            type == 'extendedTextMessage' ? msg.message?.extendedTextMessage?.text :
                type == 'imageMessage' ? msg.message?.imageMessage?.caption :
                    type == 'videoMessage' ? msg.message?.videoMessage?.caption :
                        type == 'buttonsMessage' ? msg.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.buttonsResponseMessage?.selectedDisplayText :
                            type == 'listResponseMessage' ? msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId :
                                type == 'listMessage' ? msg.message?.listMessage?.description :
                                    type == 'reactionMessage' ? msg.message?.reactionMessage?.text : ''
    ) : String(type) == 'viewOnceMessage' ? (
        type == 'conversation' ? msg.message?.viewOnceMessage?.message?.conversation :
            type == 'extendedTextMessage' ? msg.message?.viewOnceMessage?.message?.extendedTextMessage?.text :
                type == 'imageMessage' ? msg.message?.viewOnceMessage?.message?.imageMessage?.caption :
                    type == 'videoMessage' ? msg.message?.viewOnceMessage?.message?.videoMessage?.caption :
                        type == 'buttonsMessage' ? msg.message?.viewOnceMessage?.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.viewOnceMessage?.message?.buttonsResponseMessage?.selectedDisplayText :
                            type == 'listResponseMessage' ? msg.message?.viewOnceMessage?.message?.listResponseMessage?.singleSelectReply?.selectedRowId :
                                type == 'listMessage' ? msg.message?.viewOnceMessage?.message?.listMessage?.description :
                                    type == 'reactionMessage' ? msg.message?.viewOnceMessage?.message?.reactionMessage?.text : ''

    ) : String(type) == 'ephemeralMessage' ? (
        type == 'conversation' ? msg.message?.ephemeralMessage?.message?.conversation :
            type == 'extendedTextMessage' ? msg.message?.ephemeralMessage?.message?.extendedTextMessage?.text :
                type == 'imageMessage' ? msg.message?.ephemeralMessage?.message?.imageMessage?.caption :
                    type == 'videoMessage' ? msg.message?.ephemeralMessage?.message?.videoMessage?.caption :
                        type == 'buttonsMessage' ? msg.message?.ephemeralMessage?.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.ephemeralMessage?.message?.buttonsResponseMessage?.selectedDisplayText :
                            type == 'listResponseMessage' ? msg.message?.ephemeralMessage?.message?.listResponseMessage?.singleSelectReply?.selectedRowId :
                                type == 'listMessage' ? msg.message?.ephemeralMessage?.message?.listMessage?.description :
                                    type == 'reactionMessage' ? msg.message?.ephemeralMessage?.message?.reactionMessage?.text : ''


    ) : ''
    let cmd = body?.toLowerCase().split(" ")[0] || "";
    let prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/.test(cmd) ? cmd.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/gi) : "mecha";
    let isGroup = msg.key.remoteJid?.includes('g.us')

    var obj: MessageMaterial = {
        from: msg.key.remoteJid,
        pushname: msg.key.fromMe ? process.env.botname : msg.pushName,
        fromMe: msg.key.fromMe,
        sender: jidDecode(sender!)!.user,
        type,
        isGroup,
        isOwner: process.env.owner_jid!.split(',').includes(jidDecode(sender!) ? jidDecode(sender!)!.user : sender?.split(/:|@/)![0]!),
        args: body?.split(/ +/g) ?? [],
        isCommand: body?.startsWith(prefix as string),
        command: cmd!.replace(prefix as string, ''),
        body,
        mentions: msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? [],
        isMedia: (type == 'imageMessage') || (type == 'videoMessage') || (type == 'audioMessage') || (type == 'stickerMessage') || (type == 'documentMessage'),
        getBuffer: async () => await downloadMediaMessage(msg, 'buffer', {}),
        replyMessage: async (messageContent: AnyMessageContent) => await conn.sendMessage(msg.key.remoteJid!, messageContent, { quoted: msg }),
        revokeMessage: async () => await conn.sendMessage(msg.key.remoteJid!, { delete: msg.key }),
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
                                    type == 'listResponseMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.listResponseMessage?.singleSelectReply?.selectedRowId :
                                        type == 'listMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.listMessage?.description :
                                            type == 'reactionMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.reactionMessage?.text : ''
            ) : String(type) == 'viewOnceMessage' ? (
                type == 'conversation' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.conversation :
                    type == 'extendedTextMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.extendedTextMessage?.text :
                        type == 'imageMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.imageMessage?.caption :
                            type == 'videoMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.videoMessage?.caption :
                                type == 'buttonsMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.buttonsResponseMessage?.selectedDisplayText :
                                    type == 'listResponseMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.listResponseMessage?.singleSelectReply?.selectedRowId :
                                        type == 'listMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.listMessage?.description :
                                            type == 'reactionMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.reactionMessage?.text : ''
            ) : String(type) == 'ephemeralMessage' ? (
                type == 'conversation' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.conversation :
                    type == 'extendedTextMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.extendedTextMessage?.text :
                        type == 'imageMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.imageMessage?.caption :
                            type == 'videoMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.videoMessage?.caption :
                                type == 'buttonsMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.buttonsResponseMessage?.selectedDisplayText :
                                    type == 'listResponseMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.listResponseMessage?.singleSelectReply?.selectedRowId :
                                        type == 'listMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.listMessage?.description :
                                            type == 'reactionMessage' ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.reactionMessage?.text : ''
            ) : '',
            getBuffer: async () => await downloadMediaMessage(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage as proto.IWebMessageInfo, 'buffer', {})
        },
        getGroupMetadata: async () => (isGroup ? await conn.groupMetadata(msg.key.remoteJid!) : null)
    }

    return obj
}