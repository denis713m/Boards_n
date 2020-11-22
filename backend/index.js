const express = require('express');
const cors = require('cors');
const router = require('./src/router/router.js');
const app = express();
const errorHandler = require ('./src/errorHandlers/errorHandler.js');
const port = 5555;

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})