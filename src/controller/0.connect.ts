import makeWASocket, { DisconnectReason, useMultiFileAuthState, proto, AnyWASocket } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import { getWAVersion } from '../lib/Utils'
import handleMessage from './2.handleMessage'
import P from 'pino'
import processMessage from './1.processWebMessage'


async function connectMecha() {
    const { state, saveCreds } = await useMultiFileAuthState('.MECHA')
    const version = await getWAVersion()
    const sock = makeWASocket({
        // can provide additional config here
        logger: P({ level: 'error' }),
        printQRInTerminal: true,
        auth: state,
        version
    })
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectMecha()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on('messages.upsert', async m => {
        handleMessage(sock, processMessage(sock as AnyWASocket, m)!)
    })

    sock.ev.on ('creds.update', saveCreds)
}

export default connectMecha