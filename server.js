const express = require('express');
const path = require('path'); 
const bodyParser = require('body-parser');
const connectDB = require('./config/dbConn');
const app = express();
const cors = require('cors'); 
const port = process.env.PORT || 3000;
require('dotenv').config();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());


connectDB();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.use('/states', require('./routes/api/states'));

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
