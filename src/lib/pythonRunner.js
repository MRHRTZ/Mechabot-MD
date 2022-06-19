const path = require('path')
require('dotenv').config({ path: (path.join(__dirname, '../../.env')) })
const { spawn } = require('child_process')

let pyenv = process.env.python
let pyApiPath = path.join(__dirname, 'plugins', 'app.py')

const api = spawn(pyenv, [pyApiPath]);

api.stdout.on('data', (data) => {
  console.log(data?.toString());
});

api.stderr.on('data', (data) => {
  console.error(data?.toString());
});

api.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});