let express = require('express');
let sqlite = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var path = require('path');
//var Date = new Date();


var app = express();
var db = new sqlite.Database('./databases/maindb.db');


db.all("CREATE TABLE IF NOT EXISTS washer (number INTEGER, name STRING, time TIMESTAMP, duration TIMESTAMP, type STRING);")
db.all("CREATE TABLE IF NOT EXISTS dryer (number INTEGER, name STRING, time TIMESTAMP, duration TIMESTAMP, type STRING);")


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/main.html'))
})

app.get('/main.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/main.html'))
})

app.get('/halls.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/halls.html'))
})

app.get('/about.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/about.html'))
})

app.get('/styles.css', function (req, res) {
    res.sendFile(path.join(__dirname + '/styles.css'))
})

app.get('/hall_pages/styles.css', function (req, res) {
    res.sendFile(path.join(__dirname + '/styles.css'))
})

app.get('/hall_pages/carroll.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/page.html'))
})

app.get('/Pictures/easton2.jpg', function (req,res) {
    res.sendFile(path.join(__dirname + '/Pictures/easton2.jpg'))
})

app.get('/Pictures/wicomico1.jpg', function (req,res) {
    res.sendFile(path.join(__dirname + '/Pictures/wicomico1.jpg'))
})

app.get('/Pictures/worcester1.jpg', function (req,res) {
    res.sendFile(path.join(__dirname + '/Pictures/worcester1.jpg'))
})

app.get('/Pictures/carroll1.jpg', function (req,res) {
    res.sendFile(path.join(__dirname + '/Pictures/carroll1.jpg'))
})

app.get('/schedule', function (req, res) {


    db.all("DELETE FROM washer WHERE (time+duration)<" + Date.now() + ";", function () {
        db.all("DELETE FROM dryer WHERE (time+duration)<" + Date.now() + ";", function () {

            db.all("SELECT * FROM washer UNION SELECT * FROM dryer;", function (err, rows) {
                console.log("Sending rows:" + rows);
                console.log(JSON.stringify(rows))
                res.send(JSON.stringify(rows))

            })

        })
    });

    console.log("CURRENT TIME:" + Date.now())
});


app.post('/register', function (req, res) {

    console.log(req.body);


    if (    //Establishes proper request syntax
        !(req.body.user &&
            req.body.timeSlot &&
            req.body.type &&
            req.body.machine &&
            req.body.duration)
    ) {
        res.status(400).send('400: Bad Request').end();
        return;
    }


        db.all('SELECT * FROM '+req.body.type+' WHERE number = ' + req.body.machine, function (err, rows) {


            console.log(rows);

            rows.forEach(row => {
                if ((row.time <= req.body.time + req.body.duration && row.time >= req.body.time) ||
                    (row.time + row.duration >= req.body.time && row.time + row.duration <= req.body.time + req.body.duration) ||
                    (row.time <= req.body.time && row.time + row.duration >= req.body.time + req.body.duration)) {

                    res.status(400).send('400: BAD REQUEST').end();
                    return;
                }
            });

            res.status(200).end();

            scheduleTime(req);

            return;
        });




});




app.listen(3000, () => console.log("App is running and listening on port 3000"));



function scheduleTime(req) {

    console.log("CURRENT TIME:" + Date.now())

    console.log("SQL CALL::" + "INSERT INTO '" + req.body.type + "' VALUES (" + req.body.machine + ",'" + req.body.user + "'," + req.body.timeSlot + "," + req.body.duration + ",'" + req.body.type + "')");
    console.log("INSERTING:" + JSON.stringify(req.body));

    db.all("INSERT INTO '" + req.body.type + "' VALUES (" + req.body.machine + ",'" + req.body.user + "'," + req.body.timeSlot + "," + req.body.duration + ",'" + req.body.type + "')");

}

