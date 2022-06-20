import { WAVersion } from '@adiwajshing/baileys'
import * as path from 'path'
import * as fs from 'fs'
import * as dotenv from 'dotenv'
import axios from 'axios'
import chalk from 'chalk'
import figlet from 'figlet'
import moment from 'moment-timezone'
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
    if (type == 'body') {
        let gcSubject = {}
        if (opts?.isGroup) gcSubject = (await opts.getGroupMetadata())?.subject
        console.log(chalk.greenBright.bold(`[ ${process.env.botname} ]`), timeNow, chalk.magentaBright('-'), chalk.blue('From:'), chalk.white(opts.pushname ?? '-'), chalk.blue('Type:'), chalk.white(opts.type), chalk.blue('Message:'), chalk.white(opts.body ?? '-'), (opts?.isGroup ? (chalk.blue('In: ') + chalk.white(gcSubject)) : ''))
    } 
    if (type == 'info') console.log(chalk.greenBright.bold(`[ ${process.env.botname} ]`), timeNow, chalk.magentaBright('-'), chalk.yellowBright('[ INFO ]'), chalk.whiteBright(params))
    if (type == 'error') console.log(chalk.greenBright.bold(`[ ${process.env.botname} ]`), timeNow, chalk.magentaBright('-'), chalk.redBright('[ ERROR ]'), chalk.red(params))
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



export {
    getWAVersion,
    getAPI,
    getJSON,
    getBuffer,
    showTitle,
    logger,
    findDiff,
}