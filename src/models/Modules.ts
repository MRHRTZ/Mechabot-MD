import DB from '../lib/ConnectDB'
import { ModulesField, ModulesFieldDelete, ModulesList, queryStatus } from '../lib/Types/Modules'

export default class Modules {
    private _table: string = 'modules'
    constructor() {}

    public queryList: () => Promise<ModulesList> = () => {
        return new Promise((resolve, reject) => {
            var sSQL = `SELECT * FROM ${this._table}`
            DB.query(sSQL, null, (data, err) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }

    public new: (params: ModulesField) => Promise<queryStatus> = (params: ModulesField) => {
        return new Promise((resolve, reject) => {
            var sSQL = `INSERT INTO ${this._table}(${Object.keys(params).join(',')}) VALUES("${Object.values(params).join('","')}")`
            DB.query(sSQL, null, (data, err) => {
                if (err) return reject({ status: false, message: err })
                resolve({ status: true, message: data })
            })
        })
    }

    public update: (params: ModulesField) => Promise<queryStatus> = (params: ModulesField) => {
        return new Promise((resolve, reject) => {
            var sSQL = `UPDATE ${this._table} SET name="${params.name}"`
            DB.query(sSQL, null, (data, err) => {
                if (err) return reject({ status: false, message: err })
                resolve({ status: true, message: data })
            })
        })
    }

    public delete: (params: ModulesFieldDelete) => Promise<queryStatus> = (params: ModulesFieldDelete) => {
        return new Promise((resolve, reject) => {
            const name = params.delAll ? '1=1' : params.name
            var sSQL = `DELETE FROM ${this._table} WHERE name=${name}`
            DB.query(sSQL, null, (data, err) => {
                if (err) return reject({ status: false, message: err })
                resolve({ status: true, message: data })
            })
        })
    }
}
