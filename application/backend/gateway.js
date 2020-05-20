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
    let pointShopPoints = 50;

    if (user_id == null) {
      throw { error: "You are not logged in, can't RSVP to event" }
    }
    result = await unigatordb.rsvpUser(parseInt(user_id, 10), event_id, pointShopPoints);
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


app.post('/deleteUserAccount', async (req, res) => {  //DELETES all user info and account associated with the "user_to_delete_id"'s user_id. Verification phrase is caps sensitive.
  try {                                               //must be logged in as a administrator, please prompt admin to enter the verification phrase.
    let result;
    let user_id = req.user_id;
    let user_to_delete_id = req.body.user_id;
    let verification_phrase = req.body.verification_phrase;
    let VERIFICATION_PHRASE_KEY = "I am 100% sure I wish to delete this account!";    //this is also checked in the function implementation against a literal string copy.

    if (user_id == null||user_to_delete_id == null) {
      throw { error: "Please provide the required data to execute this function." }
    }
    if (verification_phrase != VERIFICATION_PHRASE_KEY) {   //Checks provided verification_phrase against key, will not delete if not matched.
      throw { error: "The verification phrase provided did not match; System could not continue with deletion of specified account." }
    }
    result = await unigatordb.deleteAccount(user_id, user_to_delete_id, verification_phrase);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(412).send(e);
  }
});
//end of Administrator endpoints.

//beginning of host endpoints

app.get('/toggleHostPoints', async (req, res) => {    //toggles enabled_hp in Host table
  try {
    let result;
    let user_id = req.user_id;
    if (user_id != null) {
      result = await unigatordb.toggleHostPoints(user_id);
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


app.get('/viewHostedEvents', async (req, res) => {    //gets list of events from this host.
  try {
    let result;
    let user_id = req.user_id;
    if (user_id != null) {
      result = await unigatordb.viewHostedEvents(user_id);
      res.json(result);
    }
    if (user_id == null) {
      throw { error: "User is not logged in." };
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.get('/viewHostPointsHost', async (req, res) => {    //toggles enabled_hp in Host table
  try {
    let result;
    let user_id = req.user_id;
    if (user_id != null) {
      result = await unigatordb.viewHostPointsHost(user_id);
      res.json(result);
    }
    if (user_id == null) {
      throw { error: "User is not logged in, cannot view who has your host points." };
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.post('/updateHostPoints', async (req, res) => {  //used to buy items from pointshop
  try {
    let result;
    let user_id = req.user_id;
    let target_user_id = req.body.user_id;
    let update_value = req.body.update_value;
    if (user_id != null) {
      result = await unigatordb.updateHostPointBalance(user_id, target_user_id, update_value);
      res.json({ message: result.message });
    }
    if (user_id == null) {
      throw { error: "User is not logged in, cannot update host points." };
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});
//end of host endpoints


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))