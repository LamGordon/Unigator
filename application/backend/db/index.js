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

unigatordb.rsvpUser = (user_id, event_id, pointShopPoints) => {
    let response;
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM unigator.RSVPList WHERE event_id=? AND user_id=?`, [event_id, user_id], async (err, result) => {
            if (err) {
                return reject(err);
            }
            try {
                if (result.length == 0) {
                    response = await unigatordb.addUserToRsvpList(event_id, user_id)
                    await unigatordb.updatePointBalance(user_id, pointsEarned);
                } else {
                    response = await unigatordb.removeUserFromRsvpList(event_id, user_id)
                    await unigatordb.updatePointBalance(user_id, (-1*pointsEarned));
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

unigatordb.getUserInfo = (acc_id) => {              //depreciated, since acc_id is no longer saved in the token
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

//beginning of Point Shop functions.

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
            if (user_id == null) {
                return reject({ error: "Please login if you wish to make a purchase." });
            }

            //allows admins to buy items for free
            admin_id = await unigatordb.getAdminId(user_id);        //check if user is an admin
            if (admin_id.length>0) {
                db.query(`INSERT IGNORE INTO unigator.PurchasedItems (user_id, item_id, enabled) VALUES(?,?,0)`, [user_id, item_id], async (err, results) => {
                    if (err) {
                        reject({ error: "System was unable to add this item to your account." });
                    }
                    return resolve({ message: "Admin Account: The item you selected has been added for free." })
                })
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

//end of Point Shop functions.

//beginning of Admin functions.

unigatordb.getAuthorizedEvents = (event_id) => { //retrives list of authorized events by event_id, leave null if you want whole table.
    return new Promise((resolve, reject) => {
        if (event_id!=null) {
            db.query(`SELECT * FROM unigator.AuthorizedEvents WHERE event_id = ?`, [event_id], (err, results) => {
                if (err) {
                    return reject("The event has not been authorized.");
                }
                return resolve(results);
            })
        }
        else if (event_id==null||event_id.length==0) {
            db.query(`SELECT * FROM unigator.AuthorizedEvents`, [event_id], (err, results) => {
                if (err) {
                    return reject("System was unable to retrieve a list of authorized events    .");
                }
                return resolve(results);
            })
        }

    });
}

unigatordb.getAdminId = (user_id) => { //retrives admin_id of current user.
    return new Promise((resolve, reject) => {
        db.query(`SELECT admin_id FROM unigator.Administrator WHERE user_id =?`, [user_id], (err, results) => {
            if (err) {
                return reject("There was an error retreving your Administrator Id.");
            }
            else if (results!=null) {
                return resolve(results);
            }
            return reject("System could not detect that you are an administrator.");;
        })
    });
}

unigatordb.authorizeEvent = (user_id, event_id) => { //adds event to AuthorizedEvents table and changes status in Event table. Pass in event_id and user_id, checks if user is an admin.
    return new Promise(async (resolve, reject) => {

        admin_id = await unigatordb.getAdminId(user_id);        //check if user is an admin
        if (admin_id.length==0) {
            return resolve("You are not an Administrator. You cannot authorize an event.");
        }
        else {
            admin_id = admin_id[0].admin_id;
        }

        ifExists = await unigatordb.getAuthorizedEvents(event_id);  //checks if event is already approved before trying to insert.
        if(ifExists.length!=0) {
            return resolve("Event:" + event_id + " has already been approved by Admin:" + ifExists[0].admin_id + ".")
        }

        db.query(`INSERT IGNORE INTO unigator.AuthorizedEvents (event_id, admin_id) VALUES(?,?)`, [event_id, admin_id], async (err, results) => {
            if (err) {
                return reject("There was an error authorizing event : " + event_id + " .");
            }
            else if (event_id==null||admin_id==null) {
                return reject("Event could not be approved due to bad passed data.");
            }
            await unigatordb.updateEventStatus(event_id, "authorized");
            return resolve("Event:" + event_id + " has been sucessfully aproved.");
            //there is no check if you try to authorize a non-existant event_id, although this is not an issue as it will not be inserted to db anyways.
        })
    });
}

unigatordb.deauthorizeEvent = (user_id, event_id) => { //removes event from AuthorizedEvents table and changes status in Event table. Pass in event_id and user_id, checks if user is an admin.
    return new Promise(async (resolve, reject) => {

        admin_id = await unigatordb.getAdminId(user_id);        //check if user is an admin
        if (admin_id.length==0) {
            return resolve("You are not an Administrator. You cannot deauthorize an event.");
        }
        else {
            admin_id = admin_id[0].admin_id;
        }

        ifExists = await unigatordb.getAuthorizedEvents(event_id);  //checks if event is already approved before trying to delete.
        if(ifExists.length!=0) {
            db.query(`DELETE From unigator.AuthorizedEvents WHERE event_id = ?`, [event_id], async (err, results) => {
                if (err) {
                    return reject("There was an error unauthorizing event : " + event_id + " .");
                }
                else if (event_id==null||admin_id==null) {
                    return reject("Event could not be deauthorized due to bad passed data.");
                }
                await unigatordb.updateEventStatus(event_id, "deauthorized");
                return resolve("Event:" + event_id + " has been sucessfully deauthorized.");
            })
        }
        else {
            return resolve("Event:" + event_id + " is not an authorized event.")
        }
    });
}

unigatordb.requestEventReview = (user_id, event_id) => { //sets the event's status to "Review Requested". Also deauthorizes event if it was already authorized.
    return new Promise(async (resolve, reject) => {

        admin_id = await unigatordb.getAdminId(user_id);        //check if user is an admin
        if (admin_id.length==0) {
            return resolve("You are not an Administrator.");
        }
        else {
            admin_id = admin_id[0].admin_id;
        }
        
        if (event_id!=null) {
            await unigatordb.deauthorizeEvent(user_id, event_id);
            await unigatordb.updateEventStatus(event_id, "Review Requested");
            return resolve("Event[" + event_id + "]'s status was sucessfully changed to 'Review Requested' .")
        }
        return reject("Unable to update the status of this event.");
    });
}

unigatordb.updateEventStatus = (event_id, statusString) => {    //updates status of event with event_id, insert literal string to status. Used in authorizeEvent with status = "authorized"
    return new Promise((resolve, reject) => {
        db.query(`UPDATE unigator.Event SET status = ? WHERE event_id = ?`, [statusString, event_id], async (err, result) => {
            if (err) {
                return reject("Unable to update the status of this event.");
            }
            return resolve("Event[" + event_id + "]'s status has been sucessfully updated to : " + statusString + ".");
        })
    });
}

unigatordb.deleteAccount = (user_id, user_to_delete_id ,verification_phrase) => {    //DELETES an account and user from the database. Used in place of Banning users for now. DO NOT GET user_to_delete_id FROM TOKEN(WILL DELETE YOUR OWN ACCOUNT).
    return new Promise(async (resolve, reject) => {

        admin_id = await unigatordb.getAdminId(user_id);        //check if user is an admin
        if (admin_id.length==0) {
            return resolve("You are not an Administrator. You cannot delete an account.");
        }

        if (verification_phrase != "I am 100% sure I wish to delete this account!") {
            return reject("The verification phrase you submitted did not match with the system's.");
        }

        user_to_delete_info = await unigatordb.getUserInfoFromUserId(user_to_delete_id);    //WARNING: DO NOT GET "user_to_delete_id" FROM TOKEN. THIS WILL DELETE YOUR OWN ACCOUNT.
        account_id_to_delete = user_to_delete_info.acc_id;

        db.query(`DELETE unigator.Account WHERE acc_id = ?`, [account_id_to_delete], (err, result) => {
            if (err) {
                return reject("System was unable to delete this user's account.");
            }
            return resolve("User[" + user_to_delete_id + "]'s account and user information has been permanently deleted.");
        })
    });
}

//end of Admin functions.

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
