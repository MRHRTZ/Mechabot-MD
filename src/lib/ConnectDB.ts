import * as mysql from 'mysql'
import * as path from 'path'
import * as dotenv from 'dotenv'

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
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(null, err);
                throw err;
            }

            connection.query(query, params, function (err, rows) {
                if (!err) {
                    connection.release();
                    callback(rows);
                } else {
                    callback(null, err);
                }
            });

            connection.on('error', function (err) {
                callback(null, err);
                throw err;
            });
        });
    };

    return {
        query: _query
    };
})();

export default DB