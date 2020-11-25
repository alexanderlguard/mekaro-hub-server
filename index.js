const express = require('express');
const connectDataBase = require('./config/db');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const app = express();

connectDataBase();

app.use(cors());
app.use(express.json( { extended: true } ));

app.use('/api/auth', require('./route/authRoute'));

app.listen(PORT, '0.0.0.0',() => {
    console.log(`the server is running in the port: ${PORT}`);
});