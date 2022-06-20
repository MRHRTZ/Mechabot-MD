import DB from '../lib/ConnectDB'
import { MenuField, MenuFieldUpdate, MenuList, queryStatus } from '../lib/Types/Menu'

export default class Menu {
    private _table: string = 'menu'
    constructor() {}

    public queryList: () => Promise<MenuList> = () => {
        return new Promise((resolve, reject) => {
            var sSQL = `SELECT * FROM ${this._table}`
            DB.query(sSQL, null, (data, err) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }

    public new: (params: MenuField) => Promise<queryStatus> = (params: MenuField) => {
        return new Promise((resolve, reject) => {
            const columns = Object.keys(params);
            const values = Object.values(params);
            var sSQL = `INSERT INTO ${this._table}('"${columns.join("','")}"') VALUES (`
            for (let i = 0; i < values.length; i++) {
                sSQL += "?";
                if (i !== values.length - 1) {
                    sSQL += ",";
                }
            }
            sSQL += ")"
            DB.query(sSQL, null, (data, err) => {
                if (err) return reject({ status: false, message: err })
                resolve({ status: true, message: data })
            })
        })
    }

    public update: (params: MenuFieldUpdate) => Promise<queryStatus> = (params: MenuFieldUpdate) => {
        return new Promise((resolve, reject) => {
            var sSQL = `UPDATE ${this._table} "${Object.keys(params).join("' = ? ,'")}"' = ? WHERE name="${params.oldname}"`
            DB.query(sSQL, Object.values(params), (data, err) => {
                if (err) return reject({ status: false, message: err })
                resolve({ status: true, message: data })
            })
        })
    }
}
