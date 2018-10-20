let express = require('express');
let sqlite = require('sqlite3').verbose();
var bodyParser = require('body-parser');


var app = express();
var SQL = new sqlite.Database(':memory:');


SQL.run("CREATE TABLE washers (number INTEGER, name STRING, time DATETIME)");//# washer, Name, Time STARTING the wash 
SQL.run("CREATE TABLE dryers (number INTEGER, name STRING, time DATETIME)");//# dryer, name, time STARTING the dry



app.use(bodyParser.json());



app.get('/schedule', function (req, res) {

    cleanDB();

    response = getScheduleAndInfo(req);

    console.log('---------------'); //Debug nonesnse. please ignore.
    console.log(response);
    console.log('- - - - - - - -');
    console.log(JSON.stringify(response));
    console.log('---------------');


    res.json(JSON.stringify(response));
});


app.post('/register', function (req, res) {
    if (!isValidBooking(req)) {
        res.status(400).send('400: Bad Request');
    }


    scheduleTime(req);



    res.status(200).end();
});




app.listen(3000, () => console.log("App is running and listening on port 3000"));



function getScheduleAndInfo(req) {



    //RETURNS the schedule + relevant info in whatever format you want... gets stringified anyways


}


function getSchedule(req) {

    //TODO: Pull all relevant data to the request req from the database 'SQL'
    //This includes, but is not limited to who is currently queued up for machines XYZ and times registered.
    //DO NOT: do any computations, etc... we'll leave that 
    //Return it (ideally as a json string but doesn't really matter -- it gets stringified anyways) 

    //RETURNS the schedule in whatever format you want... gets stringified anyways

}


function scheduleTime(req) {

    //TODO: Given some valid booking (as checked by isValidBooking(req)) schedule the timeslot
    //using the given request 'req' User, time starting, washer/dryer, machine #, etc... can be given by 
    //req.body.user, req.body.timeSlot, req.body.type, req.body.machine, etc...

    //You'll have to insert it into the SQL database, using the following format:
    //an int of the machine #, a string of the user's name, some DATETIME (in DATETIME format https://www.w3schools.com/sql/sql_dates.asp) 

    //RETURNS a boolean indicating whether or not the specified time was successfully scheduled (for the VERY rare case of multi-threaded access
    //and two people booking at the same time and the DB locks)

}


function cleanDB() {

    //TODO: go through all tables (in this case, just washer&dryer) and find all entries where the DATETIME + processing time for given machine
    // is less than the current time (AKA find any entries that SHOULD have completed by now)
    // and remove them from the table.

    //Doesn't need to return anything
}
    


function isValidBooking(req) {

    if (    //Establishes proper request syntax
        typeof req.body.user == 'string' &&
        typeof req.body.timeSlot == 'date' &&
        typeof req.body.type == 'string' &&
        typeof req.body.machine == 'integer'
    ) {
        return true;
    }

    //TODO: establish proper input, then establish that the given machine/time is available and open at the requested time
    //NOTE: the DATETIME given by the db's 'time' call is the start time of the washing. NOT the end time.
    //Therefore, you'll have to account for that with 30+/60+ minutes for each different machine.


    //Returns a boolean indicating whether or not the requested booking (in 'req') is a valid one or not
    return false;
}