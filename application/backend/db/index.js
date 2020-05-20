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

unigatordb.eventInsert = (status = "pending", name, location, description, date, time, firstCategory, secondCategory, user_id) => {
    return new Promise((resolve, reject) => {
        let response = { message: {} };
        console.log("\tInside eventInsert")
        db.query(`INSERT INTO unigator.Event  (status, name, location, description, date, time) VALUES(?,?,?,?,?,?)`,
            [status, name, location, description, date, time], async (err, result) => {
                if (err) {
                    return reject({ error: "Event could not be created" });
                }
                let event_id = result.insertId;
                try {
                    host_id = await unigatordb.addToHostCount(user_id);
                    response.message.eventHost = await unigatordb.eventHost(host_id, event_id, user_id)
                    if (firstCategory && secondCategory) {
                        response.message.firstCategory = await unigatordb.eventCategory(event_id, firstCategory)
                        response.message.secondCategory = await unigatordb.eventCategory(event_id, secondCategory)
                    } else if (firstCategory) {
                        response.message.category = await unigatordb.eventCategory(event_id, firstCategory)
                    } else if (secondCategory) {
                        response.message.category = await unigatordb.eventCategory(event_id, secondCategory)
                    }
                } catch {
                    console.log(response);
                }
                console.log(response);
                return resolve(response)
            })
    });
}

unigatordb.eventHost = (host_id, event_id, user_id) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO unigator.EventHost (host_id, event_id) VALUES(?,?)`, [host_id, event_id], async (err, results) => {
            if (err) {
                return reject("Host could not be assigned to event");
            }
            user_name = await unigatordb.getUserInfoFromUserId(user_id);
            return resolve(user_name.name)
        })
    });
}

unigatordb.addToHostCount = (user_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM unigator.Host WHERE user_id=?`, [user_id], async (err, result) => {
            if (err) {
                return reject("There was an error in the query");
            }
            let host_id;

            if (result.length == 0) {
                host_id = await unigatordb.createHost(user_id);
            } else {
                host_id = await unigatordb.updateHost(user_id);
            }
            return resolve(host_id)
        })
    });
}

unigatordb.createHost = (user_id) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO unigator.Host (user_id, event_count) VALUES(?,?)`, [user_id, 1], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result.insertId)
        })
    });
}

unigatordb.updateHost = (user_id) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE unigator.Host SET event_count = event_count + 1 WHERE user_id = ?`, [user_id], async (err, result) => {
            if (err) {
                return reject(err);
            }
            host_info = await unigatordb.getHostInfoFromUserId(user_id);
            return resolve(host_info[0].host_id)
        })
    });
}

unigatordb.getHostInfoFromUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM unigator.Host WHERE user_id = ?`, [user_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

unigatordb.eventCategory = (event_id, category) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO unigator.EventCategory (event_id, category_id) VALUES(?,?)`, [event_id, category], (err, results) => {
            if (err) {
                return reject("Event and Category could not be connected");
            }
            return resolve("Event and Category connected successfully")
        })
    });
}

unigatordb.categories = () => {
    return new Promise((resolve, reject) => {
        db.query(`Select Category.category_id, Category.type, Category.description FROM unigator.Category`, [], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results)
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

unigatordb.rsvpList = (event_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT User.user_id, User.name FROM unigator.User JOIN unigator.RSVPList 
        ON RSVPList.user_id=User.user_id WHERE event_id=?`, [event_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results)
        })
    });
}

unigatordb.rsvpUser = (user_id, event_id) => {
    let response;
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM unigator.RSVPList WHERE event_id=? AND user_id=?`, [event_id, user_id], async (err, result) => {
            if (err) {
                return reject(err);
            }
            try {
                if (result.length == 0) {
                    response = await unigatordb.addUserToRsvpList(event_id, user_id)
                } else {
                    response = await unigatordb.removeUserFromRsvpList(event_id, user_id)
                }
            } catch {
                return reject(response)
            }
            return resolve(response)
        })
    });
}

unigatordb.addUserToRsvpList = (event_id, user_id) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO unigator.RSVPList (user_id, event_id) VALUES(?,?)`, [user_id, event_id], (err, results) => {
            if (err) {
                return reject({ error: "User could not be added to RSVP list" });
            }
            return resolve({ message: "User added to RSVP list successfully" })
        })
    });
}

unigatordb.removeUserFromRsvpList = (event_id, user_id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM unigator.RSVPList WHERE user_id=? AND event_id=?`, [user_id, event_id], (err, results) => {
            if (err) {
                return reject({ error: "User could not be removed from RSVP list" });
            }
            return resolve({ message: "User removed from RSVP list successfully" })
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

unigatordb.registerUser = (name, desc = "Empty", year, email, password, point_balance = 0) => {
    return new Promise(async (resolve, reject) => {
        try {
            acc_id = await unigatordb.createAccount(email, password);
            db.query(`INSERT INTO unigator.User (name, description, year, account_id, point_balance) VALUES(?,?,?,?,?)`,
                [name, desc, year, acc_id, point_balance], (err, results) => {
                    console.log(results)
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
            let token = jwt.sign({ user_id: user[0].user_id }, 'CookieSecretUserAuth', { expiresIn: 86400 });
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
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM unigator.User WHERE user_id = ?`, [user_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results[0]);
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
            if (user_id == null) {
                return reject({ error: "Please login if you wish to make a purchase." });
            }
            let current_user_info = await unigatordb.getUserInfoFromUserId(user_id);
            let user_pointBalance = current_user_info[0].point_balance;
            if (user_pointBalance < item_cost) {        //check if user has enough points to make purchase.
                return reject({ error: "Insufficient amount of points." });
            }
            else if (user_pointBalance >= item_cost) {
                db.query(`INSERT IGNORE INTO unigator.PurchasedItems (user_id, item_id, enabled) VALUES(?,?,0)`, [user_id, item_id], async (err, results) => {
                    if (err) {
                        reject({ error: "System was unable to add this item to your account." });
                    }
                    await unigatordb.updatePointBalance(user_id, (-1 * item_cost));
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


//beginning of host functionality

unigatordb.getHostInfo = (user_id) => {
    return new Promise((resolve, reject) => {
        db.query(`Select host_id, hp_enabled FROM unigator.Host WHERE user_id = ?`, [user_id], (err, results) => {
            if (results.length == 0) {
                return reject({ error: "You are not a host." });
            }
            if (err) {
                return reject(err);
            }
            return resolve(results[0])
        })
    });
}

unigatordb.viewHostedEvents = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            host_info = await unigatordb.getHostInfo(user_id);
            host_id=host_info.host_id;
            db.query(`SELECT E.* FROM unigator.Events E, unigator.EventHost EH WHERE E.event_id = EH.event_id AND EH.host_id = ?`, [host_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results)
            })
        }catch(e){
            reject(e);
        }
    })
}

unigatordb.toggleHostPoints = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            host_info = await unigatordb.getHostInfo(user_id);

            if (host_info.hp_enabled) {
                db.query(`UPDATE unigator.Host SET hp_enabled = 0 WHERE user_id = ?`, [user_id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve({ message: "Your host points have been sucessfully enabled." })
                })
            } 
            if (!host_info.hp_enabled) {
                db.query(`UPDATE unigator.Host SET hp_enabled = 1 WHERE user_id = ?`, [user_id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve({ message: "Your host points have been sucessfully disabled." })
                })
            } 
        }catch(e){
            reject(e);
        }
    });
}

unigatordb.updateHostPointBalance = (user_id, target_user_id, update_value) => {    //updates host point balance of user with update_value (pass user_id, not acc_id).
    return new Promise(async (resolve, reject) => {
        try{
            host_info = await unigatordb.getHostInfo(user_id);
            host_id = host_info.host_id;
    
            db.query(`SELECT * FROM unigator.HostPoints WHERE user_id = ? and host_id = ?`, [target_user_id, host_id], (err, results) => {
                if (results.length==0) {
                    db.query(`INSERT INTO unigator.HostPoints (user_id, host_id, points) VALUES (?,?,?) `, [target_user_id, host_id, update_value], (err, results)  => {
                        if (err) {
                            return reject({ error: "System was unable to insert your points." });
                        }
                        return resolve({ message: "Points have been inserted." })
                    })
                }
                else if (results.length!=0) {
                    db.query(`UPDATE unigator.HostPoints SET points = (points + ?) WHERE host_id = ? AND user_id = ?`, [update_value, host_id, target_user_id], (err, results)  => {
                        if (err) {
                            return reject({ error: "System was unable to update your points." });
                        }
                        return resolve({ message: "Points have been updated." })
                    })
                }
            })
        }catch(e){
            reject(e);
        }
    })
}


unigatordb.viewHostPointsHost = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            host_info = await unigatordb.getHostInfo(user_id);
            host_id=host_info.host_id;

            db.query(`SELECT U.user_id, U.name, U.picture, U.description, U.year, HP.points AS "host points" 
                    FROM unigator.User U, unigator.HostPoints HP WHERE U.user_id = HP.user_id AND HP.host_id = ?`, [host_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results)
            })
        }catch(e){
            reject(e);
        }
    })
}

//end of host functionality

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
