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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'dijkstra2.ug.bcc.bilkent.edu.tr',
    user: 'celik.koseoglu',
    password: '3slndceo',
    database: 'celik_koseoglu'
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
            if (results.length > 0) {
                //login successful, set user credentials
                sess = req.session;
                sess.user_id = results[0].ID;
                sess.name = results[0].fname;
                sess.surname = results[0].lname;
                sess.phone_num = results[0].phone_num;
                sess.age = results[0].age;
                sess.member_since = results[0].member_since;
                sess.gender = results[0].gender;
                sess.car_license_plate = results[0].car_license_plate;
                sess.bank_account = results[0].bank_account;
                sess.smokes = results[0].smokes;

                res.render("pages/profile", {
                    user: {
                        name: sess.name,
                        surname: sess.surname,
                        email: sess.email,
                        phone_num: sess.phone_num,
                        age: sess.age,
                        member_since: sess.member_since,
                        gender: sess.gender,
                        car_license_plate: sess.car_license_plate,
                        bank_account: sess.bank_account,
                        smokes: sess.smokes
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

app.get('/available_rides', function (req, res) {

    var getRidesQuery = "SELECT * FROM SCHEDULED_RIDE";

    connection.query(getRidesQuery, function (error, results) {
        if (error) {
            throw error;
        } else {
            obj = {print: results};
            res.render('pages/available_rides', obj);
        }
    });
});

app.post('/available_rides', function (req, res) {

    var getFilteredRidesQuery = "SELECT * FROM SCHEDULED_RIDE WHERE pickup_location LIKE \"%" + req.body.filter.pickup + "%\" AND dropoff_location LIKE \"%" + req.body.filter.dropoff + "%\" UNION SELECT * FROM SCHEDULED_RIDE WHERE date_and_time LIKE \"%" + req.body.filter.pickup + "%\" AND date_and_time LIKE \"%" + req.body.filter.dropoff + "%\"";

    connection.query(getFilteredRidesQuery, function (error, results) {
        if (error) {
            throw error;
        } else {
            obj = {print: results};
            res.render('pages/available_rides', obj);
        }
    });
});

app.get('/create_ride', function (req, res) {
    res.render('pages/create_ride');
});

app.post('/create_ride', function (req, res) {

    sess = req.session;

    var number_of_empty_seats = req.body.ride.number_of_empty_seats;
    var date_and_time = req.body.ride.date_and_time;
    var pickup_location = req.body.ride.pickup_location;
    var dropoff_location = req.body.ride.dropoff_location;
    var max_luggage = req.body.ride.max_luggage;
    var pickup_flexibility = req.body.ride.pickup_flexibility;
    var possible_detour = req.body.ride.possible_detour;
    var price = req.body.ride.price;
    var other_details = req.body.ride.other_details;

    var createRideQuery = "INSERT INTO SCHEDULED_RIDE (number_of_empty_seats, date_and_time, pickup_location, dropoff_location, driver_id, driver_license_plate, max_luggage, pickup_flexibility, possible_detour, price, other_details) VALUES (" + number_of_empty_seats + ", \"" + date_and_time + "\", \"" + pickup_location + "\", \"" + dropoff_location + "\", " + sess.user_id + ", \"" + sess.car_license_plate + "\", " + max_luggage + ", \"" + pickup_flexibility + "\", \"" + possible_detour + "\", " + price + ", \"" + other_details + "\")";

    console.log(createRideQuery);
    console.log("Hello World");

    connection.query(createRideQuery, function (error, results, fields) {
        if (error) {
            throw error;
            //res.end("Some error occurred. Cannot create ride.");
        }
        else {
            res.redirect('/profile');
        }
    });
});

app.post('/profile', function (req, res) {
    sess = req.session;

    if (sess.email) {

        var updateUserQuery = "UPDATE USER SET email = \"" + req.body.user.email + "\", fname = \"" + req.body.user.name + "\", lname = \"" + req.body.user.surname + "\", phone_num = \"" + req.body.user.phone_num + "\", age=4, gender = \"" + req.body.user.gender + "\", car_license_plate = \"" + req.body.user.car_license_plate + "\", bank_account = \"" + req.body.user.bank_account + "\", smokes = " + (req.body.user.smokes == "No" ? 0 : 1) + " WHERE email=\"" + req.body.user.email + "\"";

        connection.query(updateUserQuery, function (error, results) {
            if (error) {
                res.end("There is something wrong with your inputs");
            }
            else {
                res.end("Changes saved. Go back.");
            }
        });

    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }
});

app.post("/login", function (req, res) {

    sess = req.session;

    var getPasswordQuery = "SELECT password FROM USER WHERE email=\"" + req.body.user.email + "\"";

    connection.query(getPasswordQuery, function (error, results) {
        if (error)
            throw error;
        if (results.length > 0 && results[0].password == req.body.user.password) {
            //login successful, set user credentials
            sess.email = req.body.user.email;
            sess.password = req.body.user.password;

            //redirect user to profile page
            res.redirect('/profile');
        }
        else {
            res.end("Username / Password wrong. Please go back and try again");
        }
    });
});

app.post("/register", function (req, res) {

    var registerUserQuery = "INSERT INTO USER (email, password, fname, lname, phone_num, age, rating, member_since, gender, bank_account, smokes) Values(\"" + req.body.user.email + "\", \"" + req.body.user.password + "\", \"" + req.body.user.name + "\", \"" + req.body.user.surname + "\", \"053421233\", 21, 5.0, \"2017\", \"boy\", \"IBAN123123\", 0)";

    connection.query(registerUserQuery, function (error, results, fields) {
        if (error) {
            res.end("The user with this email already exists");
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