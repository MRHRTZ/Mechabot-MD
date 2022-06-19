const { Constant, db } = require('../config/DBConnection')

function showMenu() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM menu ORDER BY type ASC`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}

function showRequiredArgs() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM input_args`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}

function updateRequiredArgs(from, required) {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO input_args(_from, required) VALUES('${from}', '${required}')`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve(data)
        })
    })
}

function deleteRequiredArgs(from) {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM input_args WHERE _from='${from}'`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve(data)
        })
    })
}
module.exports = {
    showMenu,
    showRequiredArgs,
    updateRequiredArgs,
    deleteRequiredArgs
}

