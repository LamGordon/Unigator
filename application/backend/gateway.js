const express = require('express')
const unigatordb  = require('./db')
const bodyParser = require('body-parser')

const app = express()
const port = 3003


// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/events', async (req, res) => {
  try {
    let result;
    date = req.body.date;
    let name = req.body.name;
    
    if (date == null && name == null){
      result = await unigatordb.events();
      res.json(result);
    }
    else if (date != null && name == null) {
      result = await unigatordb.eventsByDate(date);
      res.json(result);
    }
    else if (name != null){
      let results = await unigatordb.events();
      let filtered = results.filter( result  => result.name.toLowerCase().includes(name.toLowerCase()))
      res.json(filtered);
    }
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});


app.get('/events/:category', async (req,res) => {
  try {
    let result;
    let category = req.params.category;

    result = await unigatordb.eventsByCategory(category);
    res.json(result);

  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
})

app.post('/login', (req,res) => {

});

app.post('/register', (req,res) => {

});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))