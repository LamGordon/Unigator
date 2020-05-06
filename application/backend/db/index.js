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
    return new Promise(async (resolve, reject) => {
        db.query(`SELECT * FROM unigator.Account WHERE email = ?`, [email], async (err, result) => {
            let passwordMatch = await bcrypt.compare(password, result[0].password)
            if (err || !passwordMatch) {
                return reject({ error: "Invalid Email or password" });
            }
            let token = jwt.sign({account_id: result[0].acc_id}, 'CookieSecretUserAuth', {expiresIn: 86400});
            return resolve({ 
                message: "User login successfully",
                newToken: token
            })
        })
    });
}

unigatordb.getUserInfo = (acc_id) => {
    return new Promise(async (resolve, reject) => {
        db.query(`SELECT * FROM unigator.User WHERE account_id = ?`, [acc_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

unigatordb.getUserInfoFromUserId = (user_id) => {
    return new Promise( (resolve, reject) => {
        db.query(`SELECT * FROM unigator.User WHERE user_id = ?`, [user_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

unigatordb.getPointShop = () => {   //retrives all items purchasable in points shop
    return new Promise(async (resolve, reject) => {
        db.query(`SELECT * FROM unigator.PointShop`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

unigatordb.getAllPurchasedItems = (user_id) => { //retrives id of items purchased from the points shop by current user, also if enabled or not
    return new Promise(async (resolve, reject) => {
        let user_id = user_id;
        db.query(`SELECT item_id, enabled FROM unigator.PurchasedItems P WHERE user_id = ?`, [user_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

//no check if item is already purchased yet, either implement here or in frontend.
unigatordb.pointShopBuyItem = (user_id, item_id, item_cost) => {          //used to buy an item from the points shop for current user
    return new Promise(async (resolve, reject) => {
        try {
            if (user_id==null) {
                return reject({ error: "Please login if you wish to make a purchase." });
            }
            let current_user_info = await unigatordb.getUserInfoFromUserId(user_id);
            let user_pointBalance = current_user_info[0].point_balance;
            if (user_pointBalance < item_cost) {        //check if user has enough points to make purchase.
                return reject({ error: "Insufficient amount of points."});
            }  
            else if (user_pointBalance >= item_cost) {
                db.query(`INSERT IGNORE INTO unigator.PurchasedItems (user_id, item_id, enabled) VALUES(?,?,0)`, [user_id, item_id], async(err, results) => {
                    if (err) {
                        reject({ error: "System was unable to add this item to your account." });
                    }
                    await unigatordb.updatePointBalance(user_id, (-1*item_cost));
                    return resolve({ message: "Purchase Sucessful: The item you selected has been added to your account" })
                })
            }
        } catch (e) {
            reject(e)
        }
    });
}

unigatordb.updatePointBalance = (user_id, update_value) => {    //updates point balance of user with update_value (pass user_id, not acc_id).
    return new Promise((resolve, reject) => {
        db.query(`UPDATE unigator.User U SET U.point_balance = (U.point_balance+?) WHERE U.user_id = ?`, [update_value, user_id], (err, results) => {
            if (err) {
                return reject({ error: "System was unable to update your points." });
            }
            return resolve({ message: "Points have been updated." })
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