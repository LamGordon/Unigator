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
    return new Promise(async (resolve, reject) => {
        db.query(`SELECT * FROM unigator.Account WHERE email = ?`, [email], async (err, result) => {
            let passwordMatch = await bcrypt.compare(password, result[0].password)
            if (err || !passwordMatch) {
                return reject({ error: "Invalid Email or password" });
            }
            user = await unigatordb.getUserInfo(result[0].acc_id)
            let token = jwt.sign({user_id: user[0].user_id}, 'CookieSecretUserAuth', {expiresIn: 86400});
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
        db.query(`SELECT * FROM unigator.PointShop ORDER BY type, cost;`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

unigatordb.getAllPurchasedItems = (user_id) => { //retrives id of items purchased from the points shop by current user, also if enabled or not
    return new Promise(async (resolve, reject) => {
        db.query(`SELECT PI.item_id, PI.enabled, PS.name, PS.value, PS.type 
        FROM unigator.PurchasedItems PI, unigator.PointShop PS 
        WHERE PI.item_id = PS.item_id and PI.user_id = ?`, [user_id], (err, results) => {
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

unigatordb.enableItem = (user_id, item_id, enabled) => {    //enables a purchased point shop item for the user
    return new Promise((resolve, reject) => {
        if (enabled==0) {
            db.query(`UPDATE unigator.PurchasedItems PI SET PI.enabled = 1 WHERE PI.item_id = ? AND PI.user_id = ?`, [item_id, user_id], (err, results) => {
                if (err) {
                    return reject({ error: "System was unable to enable this item." });
                }
                return resolve({ message: "Your item has been sucessfully enabled." })
            })
        } 
        else if (enabled==1) {
            return resolve({ message: "This item seems to already be enabled." })
        }
        else if (enabled==null) {
            return reject({ error: "There seems to be an issue with this item, and could not be enabled." })
        }
    });
}

unigatordb.disableItem = (user_id, item_id, enabled) => {    //disables a purchased point shop item for the user
    return new Promise((resolve, reject) => {
        if (enabled==1) {
            db.query(`UPDATE unigator.PurchasedItems PI SET PI.enabled = 0 WHERE PI.item_id = ? AND PI.user_id = ?`, [item_id, user_id], (err, results) => {
                if (err) {
                    return reject({ error: "System was unable to disable this item." });
                }
                return resolve({ message: "Your item has been sucessfully disabled." })
            })
        } 
        else if (enabled==0) {
            return resolve({ message: "This item seems to already be disabled." })
        }
        else if (enabled==null) {
            return reject({ error: "There seems to be an issue with this item, and could not be disabled." })
        }
    });
}

unigatordb.disableItemByType = (user_id, type) => {    //disables all purchased point shop items of type type for the user
    return new Promise((resolve, reject) => {
        if (user_id!=1 && type!=null) {
            db.query(`UPDATE unigator.PurchasedItems PI INNER JOIN unigator.PointShop PS On PI.item_id = PS.item_id SET PI.enabled = 0 WHERE PS.type = ? AND PI.user_id = ?`, [type, user_id], (err, results) => {
                if (err) {
                    return reject({ error: "System was unable to disable items of type: " + type });
                }
                return resolve({ message: "System sucessfully disabled all items of type: " + type })
            })
        } 
        else {
            return reject({ error: "The system had an issue disabling all items of type: " + type })
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
