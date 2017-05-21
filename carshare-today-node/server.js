var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

var sess;

app.use(express.static(__dirname + '/views'));
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'dijkstra2.ug.bcc.bilkent.edu.tr',
    user     : 'celik.koseoglu',
    password : '3slndceo',
    database : 'celik_koseoglu'
});

app.get('/', function (req, res) {
    sess = req.session;
    if (sess.email) { //check if the previous user has logged out or not. If not, then display personal page.
        res.redirect('/profile');
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

app.get('/profile', function (req, res) {
    sess = req.session;

    if (sess.email) {

        var getUserInfoQuery = "SELECT * FROM USER WHERE email=\"" + sess.email + "\"";

        connection.query(getUserInfoQuery, function (error, results) {
            if (error)
                throw error;
            if(results.length > 0) {
                //login successful, set user credentials
                sess = req.session;
                sess.name = results[0].fname;
                sess.surname = results[0].lname;
                sess.phone_num = results[0].phone_num;
                sess.age = results[0].age;
                sess.gender = results[0].gender;
                sess.car_license_plate = results[0].car_license_plate;
                sess.bank_account = results[0].bank_account;
                sess.smokes = results[0].smokes;
                sess.chattiness = results[0].chattiness;

                res.render("pages/profile", {
                    user: {
                        name: sess.name,
                        surname: sess.surname,
                        email: sess.email,
                        bank_account: sess.bank_account
                    }
                });

                res.end();
            }
        });

    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }
});


app.post('/profile', function (req, res) {
    sess = req.session;

    if (sess.email) {

        var getUserInfoQuery = "SELECT * FROM USER WHERE email=\"" + sess.email + "\"";

        connection.query(getUserInfoQuery, function (error, results) {
            if (error)
                throw error;
            if(results.length > 0) {
                //login successful, set user credentials
                sess = req.session;
                sess.name = results[0].fname;
                sess.surname = results[0].lname;
                sess.phone_num = results[0].phone_num;
                sess.age = results[0].age;
                sess.gender = results[0].gender;
                sess.car_license_plate = results[0].car_license_plate;
                sess.bank_account = results[0].bank_account;
                sess.smokes = results[0].smokes;
                sess.chattiness = results[0].chattiness;

                res.render("pages/profile", {
                    user: {
                        name: sess.name,
                        surname: sess.surname,
                        email: sess.email,
                        bank_account: sess.bank_account
                    }
                });

                res.end();
            }
        });

    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }
});

app.post("/login", function (req, res) {

    sess = req.session;

    console.log("email: " + req.body.user.email);

    var getPasswordQuery = "SELECT password FROM USER WHERE email=\"" + req.body.user.email + "\"";

    connection.query(getPasswordQuery, function (error, results) {
        if (error)
            throw error;
        if(results.length > 0 &&  results[0].password == req.body.user.password) {
            //login successful, set user credentials
            sess.email = req.body.user.email;
            sess.password = req.body.user.password;

            //redirect user to profile page
            res.redirect('/profile');
            console.log("Login OK. Redirect successful...")
        }
        else {
            res.end("Username / Password wrong. Please go back and try again");
        }
    });
});

app.post("/register", function (req, res) {

    var registerUserQuery = "INSERT INTO USER (email, password, fname, lname, phone_num, age, rating, member_since, gender, bank_account, smokes, chattiness) Values(\""+ req.body.user.email +"\", \""+ req.body.user.password +"\", \"" + req.body.user.name + "\", \""+ req.body.user.surname +"\", \"053421233\", 21, 5.0, \"2017\", \"boy\", \"IBAN123123\", 0, 3)"

    connection.query(registerUserQuery, function (error, results, fields) {
        if (error) {
            res.end("The user with this email already exists");
            throw error;
        }
        else {
            sess = req.session;
            sess.email = req.body.user.email;
            sess.password = req.body.user.password;
            res.redirect('/profile');
        }
    });
});

app.listen(3000, function () {
    console.log("App Started on PORT 3000");
});