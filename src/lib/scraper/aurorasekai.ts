import axios from "axios";
import * as cheerio from "cheerio";
import { unpack } from 'unpacker';
import { resultMovieSearch, movieSearchRow } from "../Types/Aurorasekai";
import { logger } from "../Utils";

class Aurorasekai {
    private _baseUrl: string = "https://aurorasekai.com";
    private _playerUrl: string = "https://player.docomademo.my.id";
    private _themoviedbAPIKey: string = "49101d62654e71a2931722642ac07e5e";

    public Aurorasekai() { }

    public async movieDetailAPI(movieId: string) {
        const { data } = await axios.get(`https://api.themoviedb.org/3/tv/${movieId}?api_key=${this._themoviedbAPIKey}&append_to_response=credits&language=en-US&include_image_language=en,null`);
        return data
    }

    public async movieSeasonAPI(movieId: string, season: string) {
        const { data } = await axios.get(`https://api.themoviedb.org/3/tv/${movieId}/season/${season}?api_key=${this._themoviedbAPIKey}&append_to_response=credits&language=en-US&include_image_language=en,null`);
        return data
    }

    public async movieEpisodeAPI(movieId: string, season: string, episode: string) {
        const { data } = await axios.get(`https://api.themoviedb.org/3/tv/${movieId}/season/${season}/episode/${episode}?api_key=${this._themoviedbAPIKey}&append_to_response=credits&language=en-US&include_image_language=en,null`);
        return data
    }

    public async searchMovie(query: string) {
        var result: resultMovieSearch = { status: false, result: [] }
        const { data } = await axios.get(this._baseUrl + "/?s=" + query);
        const $ = cheerio.load(data);
        let rows: Array<movieSearchRow> = [];
        $('div.item-container > div.item.post').each((i, v) => {
            const rowData: movieSearchRow = {
                title: $(v).find('h2.movie-title').text(),
                link: $(v).find('a').attr('href'),
                thumbnail: $(v).find('div.item-flip div.item-inner img.lazy').attr('data-src')?.replace('w220_and_h330_face', 'w600_and_h900_bestv2'),
                description: $(v).find('p.movie-description').text(),
                rating: $(v).find('span.movierating').text(),
            };
            rows.push(rowData);
        })
        if (rows.length > 0) {
            result.status = true;
            result.result = rows;
        }
        return result;
    }

    public viewMovieDetails(query: string) {
        return new Promise((resolve, reject) => {
            this.searchMovie(query)
                .then(async (res) => {
                    if (res.status === true) {
                        var result: any = res
                        const { data } = await axios.get(res.result![0].link!);
                        const $ = cheerio.load(data);
                        let jsData = $('script#tv-js-extra').get()[0].children[0]['data'];
                        var movieAPI = JSON.parse(jsData.match(/\{.*?\}/g))
                        var movieID = movieAPI?.tvid
                        var apikey = movieAPI?.tvapikey
                        this._themoviedbAPIKey = apikey
                        this.movieDetailAPI(movieID)
                            .then(movieData => {
                                result.result = result.result[0]
                                result.result.details = movieData
                                resolve(result)
                            })
                            .catch(reject)
                    } else {
                        resolve(res)
                    }
                })
                .catch(reject);
        })
    }

    public async getEpisodes(endpoint: string) {
        var result: any = { status: false, message: '' }
        try {
            const { data } = await axios.get(this._baseUrl + endpoint);
            const $ = cheerio.load(data);
            let movieApiRaw = $('script#tv-js-extra').get()[0].children[0]['data'];
            let tvafterRaw = $('script#tv-js-after').get()[0].children[0]['data'];
            var movieAPI = JSON.parse(movieApiRaw.match(/\{.*?\}/g))
            var streamingAPI = JSON.parse(tvafterRaw.match(/\{.*?\}/g)[0]);
            var downloadAPI = JSON.parse(tvafterRaw.match(/\{.*?\}/g)[1])
            result = {
                status: true,
                movieAPI, streamingAPI, downloadAPI
            }
        } catch (e) {
            result.message = e;
        }
        return result
    }

    public getVideoBuffer(url: string) {
        return new Promise(async (resolve, reject) => {
            const docomoURL = 'https://player.docomademo.my.id'
            if (url.includes(docomoURL)) {
                const docomo = await axios.get(url);
                const $ = cheerio.load(docomo.data);
                const jwplayerData = $('script').get()[2].children[0]['data']
                const unpackedJw = unpack(jwplayerData)
                const streamUrlendPoint = unpackedJw.match(/\/stream.*?\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/g)
                const streamUrl = docomoURL + streamUrlendPoint
                const playerCookie = docomo.headers['set-cookie']![0]
                axios.get(streamUrl, { headers: { 'referer': url, cookie: playerCookie }, maxRedirects: 1, withCredentials: true })
                    .then(response => {
                        logger(response.status, 'info');
                    })
                    .catch(err => {
                        const urlOffice = err?.request?._currentUrl
                        console.log('office url: ', urlOffice);
                        if (urlOffice) {
                            axios.get(urlOffice)
                                .then(response => {
                                    console.log(response);
                                    
                                })
                                .catch(err => {
                                    console.log(err);
                                    
                                    reject({ status: false, message: err.message })
                                })
                            resolve({ status: true, result: url })
                        } else {
                            reject({ status: false, message: err.message })
                        }
                    });

            } else reject({ status: false, message: 'Invalid Docomo URL' })
        })
    }
}


let aurora = new Aurorasekai();
// aurora.searchMovie('ly').then((results) => {
//     console.log(results.result);
// })

// aurora.viewMovieDetails('lyco').then((results) => {
//     console.log(results);
// })

// aurora.movieSeasonAPI('154494', '1').then((results) => {
//     console.log(results);
// })

// aurora.getEpisodes('/kanojo-okarishimasu-s2').then((results) => {
//     console.log(results);
// })

aurora.getVideoBuffer('https://player.docomademo.my.id/v/mBNgUknVEni72Qg').then((results) => {
    console.log(results);
})