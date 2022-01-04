const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const port = 5000;
const app = express();

const db_name = 'freshValley';
const password = 'pdG42!u2A-rGU5c';


app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${db_name}:${password}@cluster0.kwnsg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
   res.send('Hello World!')
})



client.connect(err => {
  const collection = client.db("freshValley").collection("allProducts");
  console.log('database connected')

  app.post('/addProduct', (req, res) => {
     const product = req.body;
     console.log(product)
   collection.insertOne(product)
   .then(result => {
      console.log(result);
      res.send(result.acknowledged);
   })
  })

  app.get('/products', (req, res) => {
     collection.find({})
     .toArray({})
     .then(result=>{
        res.send(result)
     })
  })



});



app.listen(port);