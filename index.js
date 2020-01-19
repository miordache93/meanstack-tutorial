const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080;

const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blogs.js')(router);
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err) {
        console.log(`Could not connect to database: ' ${err}`);
    } else {
        console.log('Connected to database: meanstack');
    }
});

//Middleware
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/pubic/index.html'));
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});