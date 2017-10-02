var express = require('express');
var app = express();
var timestamp = require('unix-timestamp');
var datestuff = require('./datestuff.js')
var whoami = require('./whoami.js');
var forwarded = require('forwarded');
var headers = require('./headers');
    
app.use(express.static('public'));

app.get("/api/whoami", whoami)
app.get("/api/headers", headers)

app.get("/*", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
})
        


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
