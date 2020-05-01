const db  = require('../db')

const getEvents = async (req, res) => {

    console.log("inside events.controller")
    try {
      let result;
      let date = req.body.date;
      let name = req.body.name;
      
      if (date == null && name == null){
        result = await db.query(`SELECT * FROM unigator.Event`);
        res.json(result);
      }
      else if (date != null && name == null) {
        result = await db.query(`SELECT * FROM unigator.Event WHERE date = ?`, [date]);
        res.json(result);
      }
      else if (name != null){
        
        let results = await db.query(`SELECT * FROM unigator.Event`);
        console.log(results)
        let filtered = results.filter( result  => result.name.toLowerCase().includes(name.toLowerCase()))
        res.json(filtered);
      }
    } catch(e) {
      console.log(e);
      res.sendStatus(500);
    }
  };

const getEventsByCategory = async (req,res) => {
    try {
      let result;
      let category = req.params.category;
      let name = req.query.name;
  
      result = await db.query(`SELECT event.* FROM unigator.Event event 
              INNER JOIN unigator.EventCategory eventCategory ON event.event_id = eventCategory.event_id 
              INNER JOIN unigator.Category category ON eventCategory.category_id=category.category_id 
              WHERE category.type= ?`,
              [category])
      if (name == null) {
        res.json(result);
      }
      else if (name != null){
        let filtered = result.filter( item  => item.name.toLowerCase().includes(name.toLowerCase()))
        res.json(filtered);
      }
    } catch(e) {
      console.log(e);
      res.sendStatus(500);
    }
  };


//   const addEvent = async (req, res) => {
//     try {
//         let name = req.body.name;
//         let location = req.body.location;
//         let desc =  req.body.description;
//         let date = req.body.date;
//         let time =  req.body.time;

//         if (name != null && location != null && desc != null && date != null && time != null) {
//             result = db.query(`INSERT INTO unigator.Event  (event_id, name, location, desc, date, time) VALUES = ?`,
//                 ['', name, location, desc, date, time]);
//         }
        
//     } catch(e) {

//     }
//   }
  
  module.exports = {
      getEvents,
      getEventsByCategory
    };