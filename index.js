const express = require("express");
const admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

var serviceAccount = require("./firebaseConfig/firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db_name = process.env.DB_USER;
const password = process.env.DB_PASS;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${db_name}:${password}@cluster0.kwnsg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const productCollection = client.db("freshValley").collection("allProducts");
  const orderCollection = client.db("freshValley").collection("order");
  const orderCollection2 = client.db("freshValley").collection("order");
  console.log("database connected");

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    console.log(product);
    productCollection.insertOne(product).then((result) => {
      res.send(result.acknowledged);
    });
  });

  app.get("/products", (req, res) => {
    productCollection.find({}).toArray((err, result) => {
      res.send(result);
    });
  });

  app.get("/product/:_id", (req, res) => {
    productCollection
      .find({ _id: ObjectId(req.params._id) })
      .toArray((err, document) => {
        res.send(document);
      });
  });

  //Order post request

  app.post("/order", (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order).then((result) => {
      console.log(result);
      res.send(result);
    });
  });

  app.get("/myorder", (req, res) => {
    const queryEmail = req.query.email;
    const token = req.headers.authorization;
    admin
      .auth()
      .verifyIdToken(token)
      .then((accessToken) => {
        const tokenEmail = accessToken.email;
        if (queryEmail === tokenEmail) {
          orderCollection
            .find({ email: req.query.email })
            .toArray((err, myorder) => {
              res.send(myorder);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  app.get("/all-order", (req, res) => {
    orderCollection
      .find({})
      .toArray((err, result) => {
        res.send(result);
      })
  });

});





app.listen(port);
