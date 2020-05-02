const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cookieparser = require("cookie-parser")
const jwt = require("jsonwebtoken")

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
        db.query(`SELECT * FROM unigator.Event`, (err, results) => {
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

unigatordb.category = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM unigator.Category`, (err, results) => {
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
            let token = jwt.sign({account_id: result[0].acc_id}, 'CookieSecretUserAut', {expiresIn: 86400});
            return resolve({ 
                message: "User login successfully",
                newToken: token
            })
        })
    });
}

unigatordb.UserInfo = (acc_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM unigator.User WHERE acc_id = ?`, [acc_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

unigatordb.getUserId = (acc_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT U.user_id FROM unigator.User U WHERE acc_id = ?`, [acc_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results.user_id);
        })
    });
}

unigatordb.getPointShop = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM unigator.PointShop`, [], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

unigatordb.getAllPurchasedItems = (acc_id) => {
    return new Promise((resolve, reject) => {
        let user_id = unigatordb.getUserId(acc_id);
        db.query(`SELECT * FROM unigator.PurchasedItems WHERE user_id = ?`, [], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

//no check if item is already purchased yet, either implement here or in frontend.
unigatordb.buyItem = (acc_id, item_id, item_cost) => {          //should be used as onClick button event
    return new Promise((resolve, reject) => {
        try {
        if (acc_id==null) {
            return reject({ error: "Please login if you wish to make a purchase." });
        }
        let current_user_info = await unigatordb.UserInfo(acc_id);
        let user_id = current_user_info.user_id;
        let user_pointBalance = current_user_info.point_balance; //added this into the database under User table.
        if (user_pointBalance < item_cost) {        //check if user has enough points to make purchase.
            return reject({ error: "Insufficient amount of points."});
        }
        db.query(`INSERT INTO unigator.PurchasedItems (user_id, item_id) VALUES(?,?)`, [user_id, item_id, ], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve({ message: "Purchase Sucessful" })
        })
        } catch (e) {
            reject(e)
        }
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