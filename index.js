const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const dbo = require('./db/conn')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getUsers)
app.get('/user/:id', db.getUserById)
app.get('/search', db.findUsersBySearch)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.get('/listings', async function (req, res) {
      const dbConnect = dbo.getDb();

      dbConnect
        .collection("myFirstCollection")
        .find({}).limit(50)
        .toArray(function (err, result) {
          if (err) {
            res.status(400).send("Error fetching listings!");
         } else {
            res.json(result);
          }
        });
    });

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
