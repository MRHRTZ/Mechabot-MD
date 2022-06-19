const self_util = require('../lib/Utils')
const fs = require('fs')

async function restartAPI() {
    let Pypath = './src/lib/plugins/src/utils.py'
    let content = fs.readFileSync(Pypath, 'utf-8')
    fs.writeFileSync(Pypath, content)
}

function doYoutubeDownload(from, url, sock, msgQ) {
    return new Promise((resolve, reject) => {

    self_util.getJSON(self_util.API_BASEURL + '/api/ytdl', 'POST', {
        url
    })
        .then(async ({ result }) => {
            var listMessage = {}
            let sections = [
                {
                    title: 'Download File',
                    rows: []
                }
            ]
            for (let row of result?.videos ?? []) {
                sections[0].rows.push({
                    title: row.filesize,
                    rowId: 'ytdl-downloadexec ' + row.url + ' ' + result.title.replace(/ +/g,'##') + ' ' + row.extension + ' ' + row.format.replace(/ +/g,'##'), 
                    description: row.format + ' .' + row.extension
                })
            }
            listMessage = {
                text: result.description,
                footer: "Created By MRHRTZ, © 2022",
                title: result.title,
                buttonText: "Select Download Type ⬇️",
                sections
            }
            resolve({ status: true, listMessage, result })
            await sock.sendMessage(from, { caption: result.title, image: { url: result.thumbnail} })
            .catch((err) => {
                console.log('YT ERR THUMB:', err)
                // sock.sendMessage(from, { text: 'Result of ' + url }, { quoted: msgQ })
            })
            console.log('ok');
            // sock.sendMessage(from, { image: { url: result.thumbnail } })
            sock.sendMessage(from, listMessage)
        })
        .catch(reject)
    })

}


module.exports = {
    doYoutubeDownload,
    restartAPI
}