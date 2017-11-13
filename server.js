var express = require('express');
var app = express();
var timestamp = require('unix-timestamp');
var datestuff = require('./datestuff.js')
var whoami = require('./whoami.js');
var forwarded = require('forwarded');
var headers = require('./headers');
var shorty = require('./shorty');
var echoer = require('./echoer');

app.use(express.static('public'));

app.get("/api/whoami", whoami);
app.get("/api/headers", headers);
app.get("/api/shorty/new/:query", shorty.newUrl);
app.get("/api/shorty/:query", shorty.redirect);
app.get("/api/echoer/:query", echoer);

app.get("/checksecret", function (req, res) {
  var env = process.env.DBNAME;
  res.end(env);
});


//REMEMBER to leave this wildcard at the bottom of all the other app.get paths
app.get("/*", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
