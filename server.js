const express = require('express');
const path = require('path'); 
const bodyParser = require('body-parser');
const connectDB = require('./config/dbConn');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

app.use(bodyParser.json());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to the States API');
});
app.use('/states', require('./routes/api/states'));

// Use the 'port' variable instead of 'PORT'
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
