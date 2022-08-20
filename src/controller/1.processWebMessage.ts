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
    let body: string | null | undefined = ''
        
    if (type != 'viewOnceMessage' && type != 'ephemeralMessage') {
        if (type == 'conversation')         body = msg.message?.conversation
        if (type == 'extendedTextMessage')  body = msg.message?.extendedTextMessage?.text
        if (type == 'imageMessage')         body = msg.message?.imageMessage?.caption
        if (type == 'videoMessage')         body = msg.message?.videoMessage?.caption
        if (type == 'buttonsMessage')       body = msg.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.buttonsResponseMessage?.selectedDisplayText
        if (type == 'listResponseMessage')  body = msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId
        if (type == 'listMessage')          body = msg.message?.listMessage?.description
        if (type == 'reactionMessage')      body = msg.message?.reactionMessage?.text
    } else if (type == 'viewOnceMessage') {
        type = getContentType(msg.message!.viewOnceMessage?.message!) ?? Object.keys(msg.message!.viewOnceMessage?.message!)[0]
        if (type == 'conversation')         body = msg.message?.viewOnceMessage?.message?.conversation
        if (type == 'extendedTextMessage')  body = msg.message?.viewOnceMessage?.message?.extendedTextMessage?.text
        if (type == 'imageMessage')         body = msg.message?.viewOnceMessage?.message?.imageMessage?.caption
        if (type == 'videoMessage')         body = msg.message?.viewOnceMessage?.message?.videoMessage?.caption
        if (type == 'buttonsMessage')       body = msg.message?.viewOnceMessage?.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.viewOnceMessage?.message?.buttonsResponseMessage?.selectedDisplayText
        if (type == 'listResponseMessage')  body = msg.message?.viewOnceMessage?.message?.listResponseMessage?.singleSelectReply?.selectedRowId
        if (type == 'listMessage')          body = msg.message?.viewOnceMessage?.message?.listMessage?.description
        if (type == 'reactionMessage')      body = msg.message?.viewOnceMessage?.message?.reactionMessage?.text
    } else if (type == 'ephemeralMessage') {
        type = getContentType(msg.message!.ephemeralMessage?.message!) ?? Object.keys(msg.message!.ephemeralMessage?.message!)[0]
        if (type == 'conversation')         body = msg.message?.ephemeralMessage?.message?.conversation
        if (type == 'extendedTextMessage')  body = msg.message?.ephemeralMessage?.message?.extendedTextMessage?.text
        if (type == 'imageMessage')         body = msg.message?.ephemeralMessage?.message?.imageMessage?.caption
        if (type == 'videoMessage')         body = msg.message?.ephemeralMessage?.message?.videoMessage?.caption
        if (type == 'buttonsMessage')       body = msg.message?.ephemeralMessage?.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.ephemeralMessage?.message?.buttonsResponseMessage?.selectedDisplayText
        if (type == 'listResponseMessage')  body = msg.message?.ephemeralMessage?.message?.listResponseMessage?.singleSelectReply?.selectedRowId
        if (type == 'listMessage')          body = msg.message?.ephemeralMessage?.message?.listMessage?.description
        if (type == 'reactionMessage')      body = msg.message?.ephemeralMessage?.message?.reactionMessage?.text
    }

    let quotedType = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ? (getContentType(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage!) ?? Object.keys(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage!)[0]) : ''
    let quotedBody: string | null | undefined = ''

    if (quotedType != 'viewOnceMessage' && quotedType != 'ephemeralMessage') {
        if (quotedType == 'conversation')         quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation
        if (quotedType == 'extendedTextMessage')  quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text
        if (quotedType == 'imageMessage')         quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption
        if (quotedType == 'videoMessage')         quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.caption
        if (quotedType == 'buttonsMessage')       quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.buttonsResponseMessage?.selectedDisplayText
        if (quotedType == 'listResponseMessage')  quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.listResponseMessage?.singleSelectReply?.selectedRowId
        if (quotedType == 'listMessage')          quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.listMessage?.description
        if (quotedType == 'reactionMessage')      quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.reactionMessage?.text
    } else if (quotedType == 'viewOnceMessage') {
        quotedType = getContentType(msg.message!.viewOnceMessage?.message!) ?? Object.keys(msg.message!.viewOnceMessage?.message!)[0]
        if (quotedType == 'conversation')         quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.conversation
        if (quotedType == 'extendedTextMessage')  quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.extendedTextMessage?.text
        if (quotedType == 'imageMessage')         quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.imageMessage?.caption
        if (quotedType == 'videoMessage')         quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.videoMessage?.caption
        if (quotedType == 'buttonsMessage')       quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.buttonsResponseMessage?.selectedDisplayText
        if (quotedType == 'listResponseMessage')  quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.listResponseMessage?.singleSelectReply?.selectedRowId
        if (quotedType == 'listMessage')          quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.listMessage?.description
        if (quotedType == 'reactionMessage')      quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.reactionMessage?.text
    } else if (quotedType == 'ephemeralMessage') {
        quotedType = getContentType(msg.message!.ephemeralMessage?.message!) ?? Object.keys(msg.message!.ephemeralMessage?.message!)[0]
        if (quotedType == 'conversation')         quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.conversation
        if (quotedType == 'extendedTextMessage')  quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.extendedTextMessage?.text
        if (quotedType == 'imageMessage')         quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.imageMessage?.caption
        if (quotedType == 'videoMessage')         quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.videoMessage?.caption
        if (quotedType == 'buttonsMessage')       quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.buttonsResponseMessage?.selectedButtonId + '||' + msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.buttonsResponseMessage?.selectedDisplayText
        if (quotedType == 'listResponseMessage')  quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.listResponseMessage?.singleSelectReply?.selectedRowId
        if (quotedType == 'listMessage')          quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.listMessage?.description
        if (quotedType == 'reactionMessage')      quotedBody = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.ephemeralMessage?.message?.reactionMessage?.text
    }

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
        reactMessage: async (text) => await conn.sendMessage(msg.key.remoteJid!, { react: { text, key: msg.key, senderTimestampMs: Date.now() } }),
        quoted: {
            isMedia: (quotedType == 'imageMessage') || (quotedType == 'videoMessage') || (quotedType == 'audioMessage') || (quotedType == 'stickerMessage') || (quotedType == 'documentMessage'),
            isQuoted: msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ? true : false,
            type: quotedType as MessageType,
            body: quotedBody,
            getBuffer: async () => await downloadMediaMessage(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage as proto.IWebMessageInfo, 'buffer', {})
        },
        getGroupMetadata: async () => (isGroup ? await conn.groupMetadata(msg.key.remoteJid!) : null)
    }

    return obj
}