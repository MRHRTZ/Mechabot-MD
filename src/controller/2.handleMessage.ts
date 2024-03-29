import { WASocket } from '@adiwajshing/baileys'
import { MessageMaterial } from '../lib/Types/ProcessWebMessageTypes'
import * as utils from '../lib/Utils'
import { format } from 'util'
import * as fs from 'fs'
import * as path from 'path'
import { MenuField } from '../lib/Types/Menu'

utils.registerModule(path.join(__dirname, 'features'))

export default async function handleMessage(sock: WASocket, _: MessageMaterial) {
    if (!_ || _.type == 'senderKeyDistributionMessage') return
    utils.logger('', 'body', _);
    const moduleDir = path.join(__dirname, 'features')
    for (let mechas of fs.readdirSync(moduleDir)) {
        const modulePath = path.join(moduleDir, mechas)
        const menuObj: MenuField = await require(modulePath).default(sock, _)
        await utils.updateMenuDB(menuObj)
    }
    utils.getInputList()
        .then(async(inputList) => {
            for (let inputObj of inputList) {
                let isFrom = new RegExp(_.from!, 'g')
                let isSender = new RegExp(_.sender!, 'g')
                let inputFrom = inputObj.jid
                if (inputObj.is_input == "F" && fs.readdirSync(moduleDir).includes(inputObj.feature!) && isFrom.test(inputFrom!) && isSender.test(inputFrom!)) {
                    await require(path.join(__dirname, 'features', inputObj.feature!)).default(sock, _, inputObj)
                }
            }
        })
} 
