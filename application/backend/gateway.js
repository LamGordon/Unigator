const express = require('express')
const unigatordb = require('./db')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieparser = require("cookie-parser")
const jwt = require("jsonwebtoken")

const app = express()
const port = 3003

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());
app.use(cors());

app.use((req, res, next) => {
  if (req.cookies['Token']) {
    var decoded = jwt.verify(req.cookies['Token'], 'CookieSecretUserAuth');
    req.user_id = decoded.user_id;
  }
  next();
})

app.post('/createEvent', async (req, res) => {
  try {
    let result;
    let user_id = req.user_id;
    let categories = req.body.categories;
    let name = req.body.name;
    let date = req.body.date;
    let time = req.body.time;
    let description = req.body.description;
    let status = req.body.status;
    let location = req.body.location;

    if (user_id == null) {
      throw { error: "You are not logged in, can't create event" }
    }
    if (status != null, name != null, location != null, description != null, date != null, time != null, categories != null) {
      result = await unigatordb.eventInsert(status, name, location, description, date, time, categories[0], categories[2], user_id);
      res.json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500);
  }
})

app.post('/events', async (req, res) => {
  try {
    let result;
    date = req.body.date;
    let name = req.body.name;
    let pastEvent = req.body.pastEvent;

    if (pastEvent) {
      result = await unigatordb.pastEvents();
      if (name == null) {
        res.json(result);
      }
      else {
        let filtered = result.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
        res.json(filtered);
      }
    } else {
      if (date == null && name == null) {
        result = await unigatordb.events();
        res.json(result);
      }
      else if (date != null && name == null) {
        result = await unigatordb.eventsByDate(date);
        res.json(result);
      }
      if (name != null) {
        let results = await unigatordb.events();
        let filtered = results.filter(result => result.name.toLowerCase().includes(name.toLowerCase()))
        res.json(filtered);
      }
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.get('/events/:category', async (req, res) => {
  try {
    let result;
    let category = req.params.category;
    let name = req.query.name;

    result = await unigatordb.eventsByCategory(category);
    if (name == null) {
      res.json(result);
    }
    else if (name != null) {
      let filtered = result.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
      res.json(filtered);
    }
  } catch (e) {
    console.log(e);
    res.status(500);
  }
})

app.post('/rsvp', async (req, res) => {
  try {
    let result;
    let event_id = req.body.event_id;
    let user_id = req.user_id;

    if (user_id == null) {
      throw { error: "You are not logged in, can't RSVP to event" }
    }
    result = await unigatordb.rsvpUser(parseInt(user_id, 10), event_id);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(403).send(e);
  }
});

app.post('/rsvpList', async (req, res) => {
  try {
    let result;
    let event_id = req.body.event_id;
    let user_id = req.user_id;

    if (user_id == null) {
      throw { error: "You are not logged in, can't get RSVP list for event" }
    }
    result = await unigatordb.rsvpList(event_id);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(403).send(e);
  }
});

app.post('/login', async (req, res) => {
  try {
    let result;
    let email = req.body.email;
    let password = req.body.password;

    if (email != null && password != null) {
      result = await unigatordb.loginUser(email, password)
      res.cookie('Token', result.newToken, { maxAge: 86400 });
      res.json({ message: result.message });
    }
  } catch (e) {
    console.log(e);
    res.status(403).send(e);
  }
});

app.post('/logout', async (req, res) => {
  try {
    res.clearCookie("Token");
    res.json({ message: "User logout successful" });
  } catch (e) {
    console.log(e);
    res.status(403).send(e);
  }
});

app.post('/register', async (req, res) => {
  try {
    let result;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let desc = req.body.description;
    let year = req.body.year;

    if (name != null && email != null && password != null && year != null) {
      result = await unigatordb.registerUser(name, desc, year, email, password)
      res.json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(403).send(e);
  }
});

//beginning of Point Shop endpoints.

app.get('/pointshop', async (req, res) => { //used to display point shop
  try {
    let result;
    result = await unigatordb.getPointShop();
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.post('/buyItem', async (req, res) => {  //used to buy items from pointshop
  try {
    let result;
    let user_id = req.user_id;
    let item_id = req.body.item_id;
    let item_cost = req.body.item_cost;
    if (user_id != null) {
      result = await unigatordb.pointShopBuyItem(user_id, item_id, item_cost);
      res.json({ message: result.message });
    }
    if (user_id == null) {
      throw { error: "User is not logged in, cannot get purchased items." };
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.get('/purchaseditems', async (req, res) => {    //used to display what user has purchased
  try {
    let result;
    let user_id = req.user_id;
    if (user_id != null) {
      result = await unigatordb.getAllPurchasedItems(user_id);
      res.json(result);
    }
    if (user_id == null) {
      throw { error: "User is not logged in, cannot get purchased items." };
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.post('/toggleItem', async (req, res) => {
  try {
    let result;
    let user_id = req.user_id;
    let item_id = req.body.item_id;
    let enabled = req.body.enabled;
    let item_type = req.body.type;

    if (user_id != null && item_id != null && enabled == 1 && item_type != null) {  //if item is enabled, disables item
      result = await unigatordb.disableItem(user_id, item_id, enabled);
      res.json(result);
    }
    else if (user_id != null && item_id != null && enabled == 0 && item_type != null) { //if item is disabled, disables all of same type then enables it.
      await unigatordb.disableItemByType(user_id, item_type);
      result = await unigatordb.enableItem(user_id, item_id, enabled);
      res.json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(412).send(e);
  }
});

//end of Point Shop endpoints.

//beginning of Administrator endpoints.

app.post('/authorizeEvent', async (req, res) => {
  try {
    let result;
    let user_id = req.user_id;
    let event_id = req.body.event_id;

    if (user_id != null && event_id != null) {
      result = await unigatordb.authorizeEvent(user_id, event_id);
      res.json(result);
    }
    else if (user_id == null || event_id == null) {
      throw { error: "Could not authorize event because of null data entry." }
    }
  } catch (e) {
    console.log(e);
    res.status(403).send(e);
  }
});

app.post('/deauthorizeEvent', async (req, res) => {
  try {
    let result;
    let user_id = req.user_id;
    let event_id = req.body.event_id;

    if (user_id != null && event_id != null) {
      result = await unigatordb.deauthorizeEvent(user_id, event_id);
      res.json(result);
    }
    else if (user_id == null || event_id == null) {
      throw { error: "Could not deauthorize event because of null data entry." }
    }
  } catch (e) {
    console.log(e);
    res.status(403).send(e);
  }
});

app.post('/requestEventReview', async (req, res) => {
  try {
    let result;
    let user_id = req.user_id;
    let event_id = req.body.event_id;

    if (user_id != null && event_id != null) {
      result = await unigatordb.requestEventReview(user_id, event_id);
      res.json(result);
    }
    else if (user_id == null || event_id == null) {
      throw { error: "Could not post event for review because of null data entry." }
    }
  } catch (e) {
    console.log(e);
    res.status(403).send(e);
  }
});

//end of Administrator endpoints.

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))