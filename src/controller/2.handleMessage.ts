import { proto, MessageUpdateType, AnyWASocket } from '@adiwajshing/baileys'
import { MessageMaterial } from '../lib/Types/types'
import * as fs from 'fs/promises'

export default async function handleMessage(conn: AnyWASocket, mecha: MessageMaterial) {
    if (!mecha || mecha.type == 'senderKeyDistributionMessage') return
    console.log(mecha);
    
    if (mecha.body == 'hi') mecha.replyMessage({ text: 'apa?' })
    if (mecha.type == 'imageMessage') {
        const mybyffer = await mecha.getBuffer()
        fs.writeFile('./test-image.jpeg', mybyffer)
    } 
} 