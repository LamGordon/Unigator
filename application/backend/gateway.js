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
    req.account_id = decoded.account_id;
    console.log(decoded);
  } 
  next();
})

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/events', async (req, res) => {
  try {
    let result;
    date = req.body.date;
    let name = req.body.name;

    if (date == null && name == null) {
      result = await unigatordb.events();
      res.json(result);
    }
    else if (date != null && name == null) {
      result = await unigatordb.eventsByDate(date);
      res.json(result);
    }
    else if (name != null) {
      let results = await unigatordb.events();
      let filtered = results.filter(result => result.name.toLowerCase().includes(name.toLowerCase()))
      res.json(filtered);
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

app.post('/login', async (req, res) => {
  //TODO: Need to do logic for login
  try {
    let result;
    let email = req.body.email;
    let password = req.body.password;

    if (email != null && password != null) {
      result = await unigatordb.loginUser(email, password)
      console.log(result);
      res.cookie('Token', result.newToken, {maxAge: 86400});
      res.json({message: result.message});
    }
  } catch (e) {
    console.log(e);
    res.status(403).send(e);
  }
});

app.post('/register', async (req, res) => {
  //TODO: need to do logic for register
  try {
    let result;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let desc = req.body.description;
    let year = req.body.year;
    let supervisor = req.body.supervisor;

    if (name != null && email != null && password != null && year != null) {
      result = await unigatordb.registerUser(supervisor, name, desc, year, email, password)
      res.json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(403).send(e);
  }
});

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
    if(user_id!=null) {
      result = await unigatordb.pointShopBuyItem(user_id, item_id, item_cost);
      res.json({message: result.message});
    }
    if (user_id==null) {
      throw { error: "User is not logged in, cannot get purchased items."};
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
    if(user_id!=null) {
      result = await unigatordb.getAllPurchasedItems(user_id);
      res.json(result);
    }
    if (user_id==null) {
      throw {error: "User is not logged in, cannot get purchased items."};
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))