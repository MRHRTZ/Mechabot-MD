import DB from '../lib/ConnectDB'
import { InputField, InputFieldUpdate, InputFieldNew, InputList, queryStatus } from '../lib/Types/Input'

export default class Input {
    private _table: string = 'user_input'
    constructor() {}

    public queryList: () => Promise<InputList> = () => {
        return new Promise((resolve, reject) => {
            var sSQL = `SELECT * FROM ${this._table}`
            DB.query(sSQL, null, (data, err) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }

    public new: (params: InputFieldNew) => Promise<queryStatus> = (params: InputField) => {
        return new Promise((resolve, reject) => {
            const columns = Object.keys(params);
            const values = Object.values(params);
            if (columns.length == 0) return reject({ status: false, message: 'input.new : no parameter' })
            var sSQL = `INSERT INTO ${this._table}(${columns.join(",")}) VALUES (`
            for (let i = 0; i < values.length; i++) {
                sSQL += "?";
                if (i !== values.length - 1) {
                    sSQL += ",";
                }
            }
            sSQL += ")"
            DB.query(sSQL, values, (data, err) => {                
                if (err) return reject({ status: false, message: err })
                resolve({ status: true, message: data })
            })
        })
    }

    public update: (params: InputFieldUpdate) => Promise<queryStatus> = (params: InputFieldUpdate) => {
        return new Promise((resolve, reject) => {
            const columns = Object.keys(params)
            const values = Object.values(params);
            var sSQL = `UPDATE ${this._table} SET ${columns.join(" = ?, ")} = ? WHERE jid="${params.jid}" AND feature="${params.feature?.split("#")[0]}"`
            if (columns.length == 0) return reject({ status: false, message: 'input.update : no parameter' })
            DB.query(sSQL, values, (data, err) => {
                if (err) return reject({ status: false, message: err })
                resolve({ status: true, message: data })
            })
        })
    }
}
