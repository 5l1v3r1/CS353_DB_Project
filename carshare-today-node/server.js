var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'dijkstra2.ug.bcc.bilkent.edu.tr',
  user     : 'celik.koseoglu',
  password : '3slndceo',
  database : 'test'
});

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.post("/", function (req, res) {
    console.log(req.body.user.name);
    console.log(req.body.user.email);

    connection.connect();

    var query = "INSERT INTO USER (ID, email, password, fname, lname, phone_num, age, rating, member_since, gender, car_license_plate, bank_account, smokes, chattiness) Values(321321321, \"asdasd@gmail.com\", \"asdqwe123\", \"" + req.body.user.name + "\", \"yldmr\", \"053421233\", 21, 5.0, \"2017\", \"boy\", \"06BRN123\", \"IBAN123123\", 0, 3)"

    connection.query(query, function (error, results, fields) {
       if (error)
         throw error;
    });

    connection.end();

    res.end();
});

app.get('/', function(request, response) {
  	response.render('pages/index');
});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
});