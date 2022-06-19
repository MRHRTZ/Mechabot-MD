import * as path from 'path'
import * as dotenv from 'dotenv'
import axios from 'axios'
import { WAVersion } from '@adiwajshing/baileys/lib/Types/Socket'

dotenv.config({ path: (path.join(__dirname, '../../.env')) })

const API_BASEURL: string = 'http://localhost:' + process.env.apiport
const WAPI_VERSION_URL: string = 'https://web.whatsapp.com/check-update?version=0&platform=web'

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

function getBuffer(url, method = 'GET', data = {}) {
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
    getBuffer
}