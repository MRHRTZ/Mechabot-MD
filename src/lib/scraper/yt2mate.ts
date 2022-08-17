import axios from "axios";
import * as cheerio from "cheerio";
import * as util from "../Utils"

async function getConvertUrl() {
    try {
        const { data } = await axios.get('https://www.y2mate.com/')
        const urls = data.match(/\".*?\"/g).filter(v => v.includes('mates')).map(v => v.replace(/\"|\\/g, ''));
        if (urls.length > 0) {
            return await Promise.resolve({
                status: true,
                analyze: urls[0],
                convert: urls[1]
            })
        } else {
            return await Promise.reject({
                status: false,
                mesage: 'Not available in this country.'
            })
        }
    } catch (e) {
        return await Promise.reject({
            status: false,
            mesage: e
        })
    }
}

function parseResolution(html_data: string) {
    const $ = cheerio.load(html_data);
    const resolution: any = []
    $('table tbody tr').each((i, v) => {
        resolution.push({
            quality: $(v).find('td.txt-center > a').attr('data-fquality'),
            type: $(v).find('td.txt-center > a').attr('data-ftype'),
            size: $(v).find('td:nth-child(2)').text(),
        })
    })
    return resolution
}

function getDownloadMetadata(youtubeURL: string) {
    return new Promise((resolve, reject) => {
        getConvertUrl()
            .then(({ analyze }) => {
                let postData: any = {
                    url: youtubeURL,
                    q_auto: 0,
                    ajax: 1
                }
                postData = util.objectToQueryString(postData)
                axios.post(analyze, postData)
                    .then((analyzeResult) => {
                        const analyzeScript = analyzeResult.data
                        if (analyzeScript.status) {
                            const lyzeData = analyzeScript.result
                            const metaData = {
                                service: lyzeData.match(/video_service = ".*?\"/g)[0].replace(/video_service = "|\"/g, ''),
                                analyze_id: lyzeData.match(/k__id = ".*?\"/g)[0].replace(/k__id = "|\"/g, ''),
                                video_id: lyzeData.match(/data-id=".*?\"/g)[0].replace(/data-id="|\"/g, ''),
                                title: lyzeData.match(/k_data_vtitle = ".*?\"/g)[0].replace(/k_data_vtitle = "|\"/g, ''),
                                thumbnail: "https://" + lyzeData.match(/i\.ytimg.*?\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/g)[0],
                                resolution: parseResolution(lyzeData)
                            }
                            resolve(metaData);
                        } else {
                            reject(analyzeScript)
                        }

                    })
                    .catch(reject)

            })
            .catch(reject)
    })
}

function getDownloadURL({ service, analyze_id, video_id, type, quality }) {
    return new Promise((resolve, reject) => {
        getConvertUrl()
            .then(({ convert }) => {
                let postData: any = {
                    type: service,
                    _id: analyze_id,
                    v_id: video_id,
                    ajax: 1,
                    token: '',
                    ftype: type,
                    fquality: quality
                }
                postData = util.objectToQueryString(postData)
                axios.post(convert, postData)
                    .then((convertResult) => {
                        const convertData = convertResult.data
                        const $ = cheerio.load(convertData.result)
                        resolve($('div a').attr('href'))
                    })
                    .catch(reject)

            })
            .catch(reject)
    })
}

// getConvertUrl().then((r) => {
//     console.log(r);
// })

// getDownloadMetadata('https://www.youtube.com/watch?v=38N53PSbSY8').then((r: any) => {
//     console.log(r);
//     const { service, analyze_id, video_id } = r
//     const type = 'mp4'
//     const quality = '360'
//     getDownloadURL({ service, analyze_id, video_id, type, quality })
//     .then((dURL) => {
//         console.log(dURL);
//     }).catch(console.log);
// }).catch(console.log);

export {
    getConvertUrl,
    parseResolution,
    getDownloadMetadata,
    getDownloadURL
}