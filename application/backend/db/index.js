const mysql = require('mysql');

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
    return new Promise((resolve,reject) => {
        db.query(`SELECT * FROM unigator.Event`, (err,results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results)
        })
    });
}

unigatordb.eventsByDate = (date) => {
    return new Promise((resolve,reject) => {
        db.query(`SELECT * FROM unigator.Event WHERE date = ?`, [date], (err,results) => {
        // db.query(`SELECT COUNT(*) FROM unigator.Event`, (err,results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results)
        })
    });
}

unigatordb.eventCategory = (category_id) => {
    return new Promise((resolve,reject) => {
        db.query(`SELECT * FROM unigator.EventCategory WHERE category_id = ?`, [category_id], (err,results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results)
        })
    });
}

unigatordb.category = () => {
    return new Promise((resolve,reject) => {
        db.query(`SELECT * FROM unigator.Category`, (err,results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results)
        })
    });
}

unigatordb.eventInsert = (name, location, desc, date, time) => {
    return new Promise((resolve,reject) => {
        db.query(`INSERT INTO unigator.Event  (event_id, name, location, desc, date, time) VALUES = ?`,
         ['', name, location, desc, date, time], (err,results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0])
        })
    });
}

unigatordb.eventsByCategory = (category) => {
    return new Promise((resolve,reject) => {
        db.query(`SELECT event.* FROM unigator.Event event 
        INNER JOIN unigator.EventCategory eventCategory ON event.event_id = eventCategory.event_id 
        INNER JOIN unigator.Category category ON eventCategory.category_id=category.category_id 
        WHERE category.type= ?`,
        [category], (err,results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results)
        })
    });
}

module.exports = unigatordb;