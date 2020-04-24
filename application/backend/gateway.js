const express = require('express')
const unigatordb = require('./db')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 3003

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

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
    res.sendStatus(500);
  }
})

app.post('/login', (req, res) => {
  //TODO: Need to do logic for login
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
      console.log(result);
      res.json(result);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))