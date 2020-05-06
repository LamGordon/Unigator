const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dateFormat = require("dateformat");

const saltRounds = 5;

// Database cofigs
const db = mysql.createPool({
    connectionLimit: 20,
    host: 'unigatordb.cmxxxdwobxe2.us-west-1.rds.amazonaws.com',
    port: '3306',
    user: 'unigator',
    password: 'unigator648!',
});

const unigatordb = {}

unigatordb.events = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM unigator.Event WHERE date >= ?`, [dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results)
        })
    });
}

unigatordb.pastEvents = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM unigator.Event WHERE date < ?`, [dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results)
        })
    });
}

unigatordb.eventsByDate = (date) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM unigator.Event WHERE date = ?`, [date], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results)
        })
    });
}

unigatordb.eventInsert = (name, location, desc, date, time) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO unigator.Event  (event_id, name, location, desc, date, time) VALUES = ?`,
            [name, location, desc, date, time], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0])
            })
    });
}

unigatordb.eventsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT event.* FROM unigator.Event event 
        INNER JOIN unigator.EventCategory eventCategory ON event.event_id = eventCategory.event_id 
        INNER JOIN unigator.Category category ON eventCategory.category_id=category.category_id 
        WHERE category.type= ?`,
            [category], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results)
            })
    });
}

unigatordb.createAccount = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        password = await bcrypt.hash(password, saltRounds);
        db.query(`INSERT INTO unigator.Account (email, password) VALUES(?,?)`,
            [email, password], (err, results) => {
                if (err) {
                    reject({ error: "Email already in use" });
                } else {
                    resolve(results.insertId);
                }
            });
    })
}

unigatordb.registerUser = (supervisor = 0, name, desc = "Empty", year, email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            acc_id = await unigatordb.createAccount(email, password);
            db.query(`INSERT INTO unigator.User (supervisor, name, description, year, account_id) VALUES(?,?,?,?,?)`,
                [supervisor, name, desc, year, acc_id], (err, results) => {
                    if (err) {
                        //TODO: remove Account
                        reject(err);
                    }
                    resolve({ message: "User created successfully" })
                })
        } catch (e) {
            reject(e)
        }
    });
}

unigatordb.loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM unigator.Account WHERE email = ?`, [email], async (err, result) => {
            let passwordMatch = await bcrypt.compare(password, result[0].password)
            if (err || !passwordMatch) {
                return reject({ error: "Invalid Email or password" });
            }
            user = unigatordb.getUserInfo(result[0].acc_id)
            let token = jwt.sign({user_id: user.user_id}, 'CookieSecretUserAuth', {expiresIn: 86400});
            return resolve({ 
                message: "User login successfully",
                newToken: token
            })
        })
    });
}

unigatordb.tempalte = () => {
    return new Promise((resolve, reject) => {
        db.query(``, [], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results)
        })
    });
}

module.exports = unigatordb;

// unigatordb.registerUser = () => Promise

// registerUser()
//     .then(resolve)
//     .catch(reject)

// const query = (string, values) => new Promise((resolve, reject) => {
//     db.query(string, values, (err, results) => {
//         if (err) {
//             //TODO delete Account
//             reject(err);
//         } 
//         resolve(results)
//     })
// });

// unigatordb.registerUserV2 = async (name, email, password, username, desc = "", year = 1, age = 18) => {
//     const results = await query(`INSERT INTO unigator.Account (email, password) VALUES(?,?)`, [email, password]);
//     return results;
// }

// nigatordb.registerUser = async () => {
//     let r1;
//     try {
//         r1 = await query();
//     } catch (e) {
//         // rollback
//     }

//     try {
//         unigatordb.createUser(email, name, age);

//     } catch(e) {
//         // rollback
//     }
// }

// unigatordb.category = () => {
//     return new Promise((resolve, reject) => {
//         db.query(`SELECT * FROM unigator.Category`, (err, results) => {
//             if (err) {
//                 return reject(err);
//             }
//             return resolve(results)
//         })
//     });
// }
