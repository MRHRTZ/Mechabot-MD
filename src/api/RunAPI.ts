import * as path from 'path'
import { spawn } from 'child_process'

require('dotenv').config({ path: (path.join(__dirname, '../../.env')) })

let pyenv = process.env.python
let pyApiPath = path.join(__dirname, 'app.py')

const api = spawn(pyenv!, [pyApiPath]);

api.stdout.on('data', (data) => {
  console.log(data?.toString());
});

api.stderr.on('data', (data) => {
  console.error(data?.toString());
});

api.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});