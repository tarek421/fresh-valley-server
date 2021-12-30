const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000;
const app = express();


app.get('/', (req, res) => {
   res.send('Hello World!')
})


app.listen(port);