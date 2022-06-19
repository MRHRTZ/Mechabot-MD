import * as fs from 'fs'


/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module) {
    console.log(`Watching ${module}`)
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        console.log(module + ' updated!')
    })
}

/**
* Uncache a module
* @param {string} module Module name or path
*/
function uncache(module: string = '.') {
    return new Promise<void>((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

export { nocache, uncache }