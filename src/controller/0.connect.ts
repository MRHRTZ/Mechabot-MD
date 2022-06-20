import makeWASocket, { DisconnectReason, useMultiFileAuthState, proto, AnyWASocket } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import { getWAVersion, showTitle, logger } from '../lib/Utils'
import handleMessage from './2.handleMessage'
import P from 'pino'
import processMessage from './1.processWebMessage'
import * as path from 'path'
import * as fs from 'fs'

showTitle()
logger(`Watching ${fs.readdirSync(path.join(__dirname, 'features')).length} features!`)
async function connectMecha() {
    try {
        logger('Waiting for connection...', 'info')
        const { state, saveCreds } = await useMultiFileAuthState('.MECHA')
        const version = await getWAVersion()
        const sock = makeWASocket({
            logger: P({ level: 'error' }),
            printQRInTerminal: true,
            auth: state,
            version
        })
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                logger('connection closed due to ' + lastDisconnect?.error + ', reconnecting ' + shouldReconnect, "error")
                // reconnect if not logged out
                if (shouldReconnect) {
                    connectMecha()
                }
            } else if (connection === 'open') {
                logger('Connected to server!', 'info')
            }
        })
        sock.ev.on('messages.upsert', async m => {
            handleMessage(sock, processMessage(sock as AnyWASocket, m)!)
        })

        sock.ev.on('creds.update', saveCreds)
    } catch (error) {
        logger('We have an error: ' + error, 'error')
        logger('Restarting script in 3s...', 'info')
        await new Promise(f => setTimeout(f, 3000))
        connectMecha()
    }
}

export default connectMecha