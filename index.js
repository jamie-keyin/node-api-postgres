require('dotenv').config({ path: './config.env' });

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

app.get('/first_collection', async function (req, res) {
      const dbConnect = dbo.getDb();

      dbConnect
        .collection("myFirstCollection")
        .find({}).limit(50)
        .toArray(function (err, result) {
          if (err) {
            res.status(400).send("Error fetching items from first collection!");
         } else {
            res.json(result);
          }
        });
    });

app.post('/first_collection', function (req, res) {
  const dbConnect = dbo.getDb();

// "firstName": "James",
//  "surname": "Doe",
//  "department": "IT"
  const testDocument = {
    firstName: req.body.firstName,
    surname: req.body.surname,
    department: req.body.department
  };

  dbConnect
    .collection("myFirstCollection")
    .insertOne(testDocument, function (err, result) {
      if (err) {
        res.status(400).send("Error inserting test document!");
      } else {
        console.log(`Added a new test document with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
});


// perform a database connection when the server starts
dbo.connectToServer(function (err) {
    if (err) {
      console.error(err);
      process.exit();
    }

    // start the Express server
    app.listen(port, () => {
      console.log(`App running on port ${port}.`)
    })
});
