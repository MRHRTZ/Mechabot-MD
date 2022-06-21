import * as fs from 'fs-extra'
import * as path from 'path'

var buildPath: string = path.join(__dirname, '..', 'bin')
if (fs.existsSync(buildPath)) {
    fs.removeSync(buildPath)
}