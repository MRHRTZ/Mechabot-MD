import makeWASocket, { DisconnectReason, useMultiFileAuthState, proto, WASocket, Browsers } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import { getWAVersion, showTitle, logger } from '../lib/Utils'
import handleMessage from './2.handleMessage'
import P from 'pino'
import processMessage from './1.processWebMessage'
import * as utils from '../lib/Utils'
import * as path from 'path'
import * as fs from 'fs'
import { setMaxListeners } from 'form-data'


async function connectMecha() {
    try {
        process.setMaxListeners(0)
        logger('Waiting for connection...', 'info')
        const { state, saveCreds } = await useMultiFileAuthState('.MECHA')
        const version = await getWAVersion()
        const sock = makeWASocket({
            logger: P({ level: 'silent' }),
            printQRInTerminal: true,
            auth: state,
            browser: Browsers.appropriate('Desktop'),
            version
        })
        sock.ev.on('connection.update', async (update) => {
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
                await showTitle({ wa_version: version.join(','), mecha_commit: utils.getExec('git log -1 --pretty=%B').replace(/\n/g, '') })
            }
        })
        sock.ev.on('messages.upsert', async m => {
            handleMessage(sock, processMessage(sock as WASocket, m)!)
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