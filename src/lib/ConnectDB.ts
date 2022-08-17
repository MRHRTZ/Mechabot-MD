import * as mysql from 'mysql'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { logger } from './Utils';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })

var pool = mysql.createPool({
    connectionLimit : 10,
    host: process.env.mysql_hostname,
    user: process.env.mysql_username,
    password: process.env.mysql_password,
    database: process.env.mysql_database
});

var DB = (function () {
    function _query(query: string, params, callback: (msg, err?) => void) {
        pool.setMaxListeners(0)
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(null, err);
                // logger(err, 'error');
                
                throw err;
            }

            connection.query(query, params, function (err, rows) {
                if (!err) {
                    connection.release();
                    callback(rows);
                } else {
                    // logger(err, 'error');

                    callback(null, err);
                }
            });

            connection.on('error', function (err) {
                callback(null, err);
                // logger(err, 'error');

                throw err;
            });
        });
    };

    return {
        query: _query
    };
})();

export default DB