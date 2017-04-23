var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get("/cinemas", function(req, res) {
	var cinemas = JSON.parse(fs.readFileSync("cinemas.json"));
	res.send(cinemas);
});

app.post("/reservations", function(req, res) {
	var reservations = JSON.parse(fs.readFileSync("reservations.json"));
	var currentRes;
	for(currentRes of reservations){
		if(currentRes.id === req.body.movie && currentRes.sid === req.body.show){
			break;
		}
	}
	res.send(currentRes.reserved);
});

app.get("/genres", function(req, res) {
	var genres = JSON.parse(fs.readFileSync("genres.json"));
	res.send(genres);
});

app.get("/movies", function(req, res) {
	var movies = JSON.parse(fs.readFileSync("movies.json"));
	res.send(movies);
});

app.post("/login", function(req, res){
	var users = JSON.parse(fs.readFileSync("users.json"));

	var user = undefined;
	for(var currentUser of users){
		if(currentUser.uname === req.body.uname && currentUser.pw === req.body.pw){
			user = currentUser;
			console.log("%s logged in", user.uname);
		}
	}
	res.send(user);
	res.end();
});

app.post("/edit", function(req, res){
	var users = JSON.parse(fs.readFileSync("users.json"));

	for(var currentUser of users){
		if(currentUser.uname === req.body.uname){
			currentUser.name = req.body.name;
			console.log(req.body.pw);
			if(req.body.pw != "" && req.body.pw != undefined){
				currentUser.pw = req.body.pw;
			}
			console.log("edit happened");
			res.status(200);
			fs.writeFileSync("users.json", JSON.stringify(users));
			break;
		}
	}
	res.end();
});

app.post("/buy", function(req, res){
	var reservations = JSON.parse(fs.readFileSync("reservations.json"));

	for(var currentMovie of reservations){
		if(currentMovie.id === req.body.movie.id && currentMovie.sid === req.body.show.id){
			currentMovie.reserved.push({"x": req.body.seatx, "y": req.body.seaty, "user": req.body.uname});
			console.log("%s bought a ticket", req.body.uname);
			fs.writeFileSync("reservations.json", JSON.stringify(reservations));
			break;
		}
	}
	res.end();
});

var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log("The server is listening at http://%s:%s", host, port);
});
