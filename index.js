let express = require('express');
let sqlite = require('sqlite3').verbose();
var bodyParser = require('body-parser');


var app = express();
var SQL = new sqlite.Database(':memory:');


SQL.run("CREATE TABLE washers (number INTEGER, name STRING, ");




app.use(bodyParser.json());



app.get('/schedule', function (req, res) {
    let a = [];


    a.schedule;//Pull the schedule from SQL and compile into json


    res.json({ yay: 'yayzerz' });
});


app.post('/register', function (req, res) {
    if (isValidBooking(req)) {
        res.status(400).send('400: Bad Request');
    }


    //Process the schedule here for all the things



    res.status(200).end();
});




app.listen(3000);














function isValidBooking(req) {

    if (    //Establishes proper request syntax
        typeof req.body.user == 'string' &&
        typeof req.body.timeSlot == 'date' &&
        typeof req.body.process == 'string' &&
        typeof req.body.machine == 'integer'
    ) {
        return true;
    }

    //Establishes that the requested machine is working and good

    return false;
}