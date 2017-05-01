var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'dijkstra2.ug.bcc.bilkent.edu.tr',
  user     : 'celik.koseoglu',
  password : '3slndceo',
  database : 'celik_koseoglu'
});



var express = require('express');
var fs = require('fs');

var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {

  	response.render('pages/index');

  	connection.connect();

	connection.query('SELECT * FROM customer', function (error, results, fields) {
	  if (error)
	 	throw error;
	  res.send(results[0].name);
	});

	connection.end();

});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
});