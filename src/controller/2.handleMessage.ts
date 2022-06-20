import { AnyWASocket } from '@adiwajshing/baileys'
import { MessageMaterial } from '../lib/Types/ProcessWebMessageTypes'
import * as utils from '../lib/Utils'
import * as fs from 'fs'
import * as path from 'path'
import Menu from '../models/Menu'
import { MenuList } from '../lib/Types/Menu'

const menu = new Menu()

const moduleDir = path.join(__dirname, 'features')
var watching = false;
let moduleCache: string[] = []

for (let mechas of fs.readdirSync(moduleDir)) {
    moduleCache.push(mechas)
    var modulePath = path.join(moduleDir, mechas)
    fs.watch(modulePath, async (_event: fs.WatchEventType, filename) => {
        try {
            if (watching) return;
            watching = true;
            if (_event == 'change') {
                delete require.cache[modulePath]
                // const obj = require(modulePath).default(null, null, true)
                // const menuList: MenuList = await menu.queryList()
                // const includeModule = menuList.filter(v => v.name == obj.name)
                // if (includeModule.length > 0) {
                //     menu.update({ ...obj, modulePath, oldname: obj.name })
                // } else {
                //     menu.new({ ...obj, modulePath })
                // }
                utils.logger(`Reloading ${filename} changes ...`, 'info')
            } else {
                const newName = utils.findDiff(fs.readdirSync(moduleDir), moduleCache)
                utils.logger(`Rename ${mechas} > ${newName[0]}, need restart!`, 'info')
            }
            setTimeout(() => {
                watching = false;
            }, 1000);
        } catch (e) {
            utils.logger(e, 'error')
        }
    })
}

export default async function handleMessage(sock: AnyWASocket, _: MessageMaterial) {
    if (!_ || _.type == 'senderKeyDistributionMessage') return
    utils.logger('', 'body', _);
    const moduleDir = path.join(__dirname, 'features')
    for (let mechas of fs.readdirSync(moduleDir)) {
        const modulePath = path.join(moduleDir, mechas)
        require(modulePath).default(sock, _)
    }
} 