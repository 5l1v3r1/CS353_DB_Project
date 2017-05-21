var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var sess;

app.get('/', function (req, res) {
    sess = req.session;
    if (sess.email) { //check if the previous user has logged out or not. If not, then display personal page.
        res.redirect('/admin');
    }
    else {
        res.render('pages/login');
    }
});

app.get('/register', function (req, res) {
    res.render('pages/register');
});

app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

app.get('/admin', function (req, res) {
    sess = req.session;
    if (sess.email) {
        res.write('<h1>Hello ' + sess.email + '</h1>');
        res.end('<a href="/logout">Logout</a>');
    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }
});

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'dijkstra2.ug.bcc.bilkent.edu.tr',
    user     : 'celik.koseoglu',
    password : '3slndceo',
    database : 'celik_koseoglu'
});


app.post("/login", function (req, res) {

    sess = req.session;
    sess.email = req.body.user.email;
    sess.password = req.body.user.password;

    console.log("email: " + req.body.user.email);

    var getPasswordQuery = "SELECT password FROM USER WHERE email=\"" + req.body.user.email + "\"";

    connection.query(getPasswordQuery, function (error, results) {
        if (error)
            throw error;
        if(results.length > 0 &&  results[0].password == sess.password)
            res.redirect('/admin');
        else {
            res.end();
        }
    });
});

app.post("/register", function (req, res) {

    var registerUserQuery = "INSERT INTO USER (ID, email, password, fname, lname, phone_num, age, rating, member_since, gender, car_license_plate, bank_account, smokes, chattiness) Values(321321321, \""+ req.body.user.email +"\", \""+ req.body.user.password +"\", \"" + req.body.user.name + "\", \""+ req.body.user.surname +"\", \"053421233\", 21, 5.0, \"2017\", \"boy\", \"06BRN123\", \"IBAN123123\", 0, 3)"

    connection.query(registerUserQuery, function (error, results, fields) {
        if (error)
            throw error;
    });

    res.end();
});

app.listen(3000, function () {
    console.log("App Started on PORT 3000");
});