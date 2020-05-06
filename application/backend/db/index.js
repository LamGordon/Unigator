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
            let token = jwt.sign({account_id: result[0].acc_id}, 'CookieSecretUserAut', {expiresIn: 86400});
            return resolve({ 
                message: "User login successfully",
                newToken: token
            })
        })
    });
}

unigatordb.getUserInfo = (acc_id) => {
    console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Inside getUserInfo~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n")
    return new Promise(async (resolve, reject) => {
        db.query(`SELECT * FROM unigator.User WHERE account_id = ?`, [acc_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

unigatordb.getUserId = (acc_id) => {
    console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Inside getUserId~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n")
    return new Promise(async (resolve, reject) => {
        try {
            db.query(`SELECT user_id FROM unigator.User WHERE account_id = ?`, [acc_id], async (err, results) => {
                if (err) {
                    return reject(err);
                }
                console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UserId = " + results[0].user_id + " ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n")
                return resolve(results[0].user_id);
            })
        } catch (e) {
            reject(e)
        }
    });
}

unigatordb.getPointShop = () => {   //retrives all items purchasable in points shop
    console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Inside getPointShop~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
    return new Promise(async (resolve, reject) => {
        db.query(`SELECT * FROM unigator.PointShop`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

unigatordb.getAllPurchasedItems = (acc_id) => { //retrives id of items purchased from the points shop by current user, also if enabled or not
    console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Inside getAllPurchasedItems~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
    return new Promise(async (resolve, reject) => {
        let user_id = await unigatordb.getUserId(acc_id);
        console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UserId = " + user_id + " ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n")
        db.query(`SELECT * FROM unigator.PurchasedItems P WHERE user_id = ?`, [user_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

//no check if item is already purchased yet, either implement here or in frontend.
unigatordb.pointShopBuyItem = (acc_id, item_id, item_cost) => {          //used to buy an item from the points shop for current user
        console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Inside pointShopBuyItem~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
    return new Promise(async (resolve, reject) => {
        try {
            if (acc_id==null) {
                return reject({ error: "Please login if you wish to make a purchase." });
            }
            let current_user_info = await unigatordb.getUserInfo(acc_id);
            let user_id = current_user_info[0].user_id;
                console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UserId = " + user_id + " ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n")
            let user_pointBalance = current_user_info[0].point_balance; //added this into the database under User table.
                console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PointBalance = " + user_pointBalance + " ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n")
            if (user_pointBalance < item_cost) {        //check if user has enough points to make purchase.
                return reject({ error: "Insufficient amount of points."});
            }  
            else if (user_pointBalance >= item_cost) {
                    console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Inside UPB >= item_cost~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
                db.query(`INSERT IGNORE INTO unigator.PurchasedItems (user_id, item_id, enabled) VALUES(?,?,0)`, [user_id, item_id], (err, results) => {
                    if (err) {
                        reject({ error: "System was unable to add this item to your account." });
                    }
                    db.query(`UPDATE unigator.User U SET U.point_balance = (U.point_balance-?) WHERE U.user_id = ?`, [item_cost, user_id], (err, results) => {
                        if (err) {
                            reject({ error: "System was unable to deduct the necessary points from your balance." });
                        }
                        resolve({ message: "Points have now been deducted from your balance." })
                    })
                    return resolve({ message: "Purchase Sucessful: The item you selected has been added to your account" })
                })
            }
        } catch (e) {
            reject(e)
        }
    });
}

unigatordb.togglePointShopItem = (acc_id, item_id, enabled_status) => {     //handles enabling and disabling an item of choice for user
    console.log("Inside togglePointShopItem");
    return new Promise(async (resolve, reject) => {
        try{
        if (enabled_status == 1) {
            await unigatordb.disablePointShopItem(acc_id, item_id);
            return resolve({ message: "Sucessfully disabled." })
        }
        else if (enabled_status == 0 || enabled_status == null) {
            await unigatordb.enablePointShopItem(acc_id, item_id);
            return resolve({ message: "Sucessfullly enabled." })
        }
        else {
            return reject({ error : "Something went wrong in togglePointShopItem"});
        }
    } catch (e) {
        reject(e);
    }
    });
}

unigatordb.enablePointShopItem = (acc_id, item_id) => {     //enables item of choice for user
        console.log("Inside enablePointShopItem");
    return new Promise(async (resolve, reject) => {
        try {
            let user_id = await unigatordb.getUserId(acc_id);
            console.log("USERID" + user_id)
            console.log("ITEMID" + item_id)
            unigatordb.disableAllPointShopItems(acc_id);
            db.query(`UPDATE unigator.PurchasedItems P SET P.enabled = 1 WHERE P.user_id = ? AND P.item_id = ?  `, [user_id, item_id], (err, results) => {
                if (err) {
                    return reject({ error: "System was unable to enable this item." });
                }
                console.log("I Finished");
                return resolve({ message: "The selected item has sucessfully been enabled." });
            })
        }
        catch (e) {
            reject(e);
        }
    });
}

unigatordb.disablePointShopItem = (acc_id, item_id) => {    //de-enables item of choice for user
        console.log("Inside disablePointShopItem");
    return new Promise(async (resolve, reject) => {
        let user_id = unigatordb.getUserId(acc_id);
        db.query(`UPDATE unigator.PurchasedItems P SET P.enabled = 0 WHERE P.user_id = ? AND P.item_id = ?  `, [user_id, item_id], (err, results) => {
            if (err) {
                return reject({ error: "System was unable to disable this item." });
            }
            return resolve({ message: "The selected item has sucessfully been disabled." });
        })
    });
}

unigatordb.disableAllPointShopItems = (acc_id) => {    //de-enables all point shop items for current user
        console.log("Inside disableAllPointShopItems");
    return new Promise(async (resolve, reject) => {
        let user_id = unigatordb.getUserId(acc_id);
        db.query(`UPDATE unigator.PurchasedItems P SET P.enabled = 0 WHERE user_id = ?`, [user_id], (err, results) => {
            if (err) {
                return reject({ error: "System was unable to disable all items." });
            }
            return resolve({ message: "All items have been sucessfully been disabled." });
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