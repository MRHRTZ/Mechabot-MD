import { proto, WASocket, WAVersion } from '@adiwajshing/baileys'
import * as path from 'path'
import * as fs from 'fs'
import * as choki from 'chokidar'
import * as dotenv from 'dotenv'
import * as util from 'util'
import axios from 'axios'
import chalk from 'chalk'
import figlet from 'figlet'
import moment from 'moment-timezone'
import Menu from '../models/Menu'
import { MenuField } from './Types/Menu'
import Input from '../models/Input'
import { MessageMaterial } from './Types/ProcessWebMessageTypes'
moment().tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')

dotenv.config({ path: (path.join(__dirname, '../../.env')) })

const API_BASEURL: string = 'http://localhost:' + process.env.apiport
const WAPI_VERSION_URL: string = 'https://web.whatsapp.com/check-update?version=0&platform=web'

function showTitle() {
    console.log(chalk.redBright(figlet.textSync('Mecha-V3', 'Fire Font-s')));
    console.log(chalk.blue('Creator'), ':', chalk.white('MRHRTZ\n'));
}

async function logger(params: any, type: string = 'info' || 'error' || 'body', opts: any = {}) {
    let timeNow = chalk.bgGrey(moment(new Date().valueOf()).format('HH:mm:ss DD/MM/YYYY'))
    let paddingSize = 12;
    if (type == 'body') {
        let gcSubject = {}
        if (opts?.isGroup) gcSubject = (await opts.getGroupMetadata())?.subject
        console.log("\n\n==================" + chalk.greenBright.bold("[ Message ]") + "==================");
        console.log(chalk.blue('Time'.padEnd(paddingSize) + ':'), timeNow);
        if (opts?.isGroup) {
            console.log(chalk.blue('Group Name'.padEnd(paddingSize) + ':'), chalk.white(gcSubject) ?? '-');
        }
        console.log(chalk.blue('From'.padEnd(paddingSize) + ':'), chalk.white(opts.pushname ?? '-'));
        console.log(chalk.blue('Type'.padEnd(paddingSize) + ':'), chalk.white(opts.type));
        console.log(chalk.blue('Message'.padEnd(paddingSize) + ':'), chalk.white(opts.body ?? '-'));
        console.log('===================================================\n');
    } else if (type == 'info') {
        console.log("\n\n==================" + chalk.yellowBright.bold("[ Information ]") + "==================");
        console.log(chalk.blue('Time'.padEnd(paddingSize) + ':'), timeNow);
        console.log(chalk.blue('Info Message'.padEnd(paddingSize) + ':'), chalk.whiteBright(params));
        console.log('===================================================\n');
    } else if (type == 'error') {
        console.log("\n\n==================" + chalk.redBright.bold("[ Error ]") + "==================");
        console.log(chalk.blue('Time'.padEnd(paddingSize) + ':'), timeNow);
        console.log(chalk.blue('Err Message'.padEnd(paddingSize) + ':'), chalk.gray(params));
        console.log('===================================================\n');
    }
}

function findDiff(arraySearch: string[], oldArray: string[]) {
    return arraySearch.filter(x => oldArray.indexOf(x) === -1)
}

function getJSON(url: string, method: string = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
        if (method == 'POST') {
            axios({
                url,
                method: 'POST',
                data,
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(({ data }) => resolve(data))
                .catch(reject)
        } else {
            axios.get(url)
                .then(({ data }) => resolve(data))
                .catch(reject)
        }
    })
}

function getBuffer(url: string, method: string = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
        if (method == 'POST') {
            axios({
                url,
                method: 'POST',
                data,
                responseType: 'arraybuffer',
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(resolve)
                .catch(reject)
        } else {
            axios.get(url, { responseType: 'arraybuffer' })
                .then(({ data }) => resolve(data))
                .catch(reject)
        }
    })
}

function getAPI() {
    return new Promise((resolve, reject) => {
        getJSON(API_BASEURL + '/api')
            .then(resolve)
            .catch(reject)
    })
}


function getWAVersion() {
    return new Promise<WAVersion>((resolve, reject) => {
        axios.get(WAPI_VERSION_URL)
            .then(({ data }) => {
                const version = data.currentVersion.split('.').map(i => Number(i))
                resolve(version)
            })
            .catch(reject)
    })
}

async function checkMenu(module_id: number) {
    const menu = new Menu()
    const listMenu = await menu.queryList()
    const listModule = listMenu.map(v => v.module_id)

    return listModule.includes(module_id)
}

async function updateMenuDB(menuObj: MenuField) {
    const check = await checkMenu(menuObj?.module_id ?? 0)
    const menu = new Menu()
    if (check) {
        menu.update({ ...menuObj }).catch(e => logger(util.format(e), 'error'))
    } else {
        menu.new({ ...menuObj }).catch(e => logger(util.format(e), 'error'))
    }
}

async function getInputList() {
    const input = new Input()
    const inputList = await input.queryList()
    return inputList
}

function registerFeature(moduleDir: string) {
    const watcher = choki.watch(moduleDir, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
    });

    watcher
        .on('add', async filepath => {
            try {
                var filename = path.basename(filepath)
                if (Object.keys(require.cache).includes(filepath)) {
                    logger(`File ${filename} has been added, adding module ...`, 'info')
                } else {
                    logger(`File ${filename} has been added`, 'info')
                }
            } catch (e) {
                logger(e, 'error')
            }
        })
        .on('change', async filepath => {
            try {
                var filename = path.basename(filepath)
                if (Object.keys(require.cache).includes(filepath)) {
                    delete require.cache[filepath]
                    logger(`File ${filename} has been changed, updating module ...`, 'info')
                } else {
                    logger(`File ${filename} has been changed`, 'info')
                }
            } catch (e) {
                logger(e, 'error')
            }
        })
        .on('unlink', async filepath => {
            try {
                var filename = path.basename(filepath)
                if (Object.keys(require.cache).includes(filepath)) {
                    logger(`File ${filename} has been removed, deleting module ...`, 'info')
                } else {
                    logger(`File ${filename} has been removed`, 'info')
                }
            } catch (e) {
                logger(e, 'error')
            }
        })
}

function objectToQueryString(obj) {
    var str: Array<string> = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

async function waitMessage(sock: WASocket, m: MessageMaterial, message?: string, ) {
    const msgWait: proto.IWebMessageInfo = await m?.replyMessage({ text: message ?? '' })
    await sock.sendMessage(m.from!, { react: { text: "⌛", key: msgWait.key } })
    return msgWait
}

async function reactRemove(sock: WASocket, m: MessageMaterial, msgWait: proto.IWebMessageInfo) {
    await sock.sendMessage(m.from!, { react: { text: "", key: msgWait.key, senderTimestampMs: Date.now() } })
}

async function reactWait(sock: WASocket, m: MessageMaterial, msgWait: proto.IWebMessageInfo) {
    return await sock.sendMessage(m.from!, { react: { text: "⌛", key: msgWait.key } })
}

async function reactSuccess(sock: WASocket, m: MessageMaterial, msgWait: proto.IWebMessageInfo) {
    return await sock.sendMessage(m.from!, { react: { text: "✅", key: msgWait.key } })
}

async function reactFailed(sock: WASocket, m: MessageMaterial, msgWait: proto.IWebMessageInfo) {
    return await sock.sendMessage(m.from!, { react: { text: "❌", key: msgWait.key } })
}

function timeTags(slice: number) {
    return "#" + new Date().valueOf().toString().slice(slice)
}

export {
    getWAVersion,
    getAPI,
    getJSON,
    getBuffer,
    showTitle,
    logger,
    findDiff,
    registerFeature,
    checkMenu,
    updateMenuDB,
    getInputList,
    objectToQueryString,
    waitMessage,
    timeTags,
    reactWait,
    reactRemove,
    reactSuccess,
    reactFailed
}