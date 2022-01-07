const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

const db_name = process.env.DB_USER;
const password = process.env.DB_PASS;


app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${db_name}:${password}@cluster0.kwnsg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
   res.send('Hello World!')
})



client.connect(err => {
  const productCollection = client.db("freshValley").collection("allProducts");
  const orderCollection = client.db("freshValley").collection("order");
  console.log('database connected')

  app.post('/addProduct', (req, res) => {
     const product = req.body;
     console.log(product)
     productCollection.insertOne(product)
   .then(result => {
      console.log(result);
      res.send(result.acknowledged);
   })
  })

  app.get('/products', (req, res) => {
   productCollection.find({})
     .toArray((err, result) => {
        res.send(result)
     })
  })

  app.get('/product/:_id', (req, res) => {
   productCollection.find({_id: ObjectId(req.params._id)})
     .toArray((err, document)=>{
        res.send(document);
     })
  })

//Order post request

  app.post('/order', (req, res)=>{
     const order = req.body;
     orderCollection.insertOne(order)
     .then(result =>{
      console.log(result);
        res.send(result);
     })
  })


  app.get('/myorder', (req, res) =>{
     orderCollection.find({})
     .toArray((err, myorder)=>{
        res.send(myorder)
     })
  })




});



app.listen(port);