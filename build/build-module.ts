import * as fs from 'fs'
import * as path from 'path'
import { getWAVersion } from '../src/lib/Utils'

var versionPath = path.join(__dirname, '..', 'node_modules', '@adiwajshing', 'baileys', 'lib', 'Defaults', 'baileys-version.json')
if (!fs.existsSync(versionPath)) {
    getWAVersion()
    .then((version) => {    
        console.log('====================================');
        console.log('Patched version : ' + version);
        console.log('====================================');    
        fs.writeFileSync(versionPath, JSON.stringify(version))
    }).catch(console.log);
}