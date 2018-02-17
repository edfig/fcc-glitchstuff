var express = require('express');
var app = express();

var timestamp = require('unix-timestamp');
var datestuff = require('./datestuff.js')
var whoami = require('./whoami.js');
var forwarded = require('forwarded');
var headers = require('./headers');
var shorty = require('./shorty');
var echoer = require('./echoer');
var imagesearch = require('./imagesearch');
var uaparse = require('./uaparse');
var mongodb = require('mongodb');

var bodyParser = require('body-parser');
var cors = require('cors');
var multer = require('multer');
var upload = multer({dest:'uploads/'});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

app.post('/upload', upload.single('file'), function(req, res, next) {
  var filesize = JSON.stringify(req.file.size);
  let obj = {'size':filesize};
  //return filesize;
  res.end(JSON.stringify(obj));
});


app.get("/api/whoami", whoami);
app.get("/api/headers", headers);
app.get("/api/shorty/new/:query", shorty.newUrl);
app.get("/api/shorty/:query", shorty.redirect);
app.get("/api/echoer/:query", echoer);
app.get('/api/uaparse', uaparse);

//testing how to pass parameters
app.get('/api/paramtest/:testVal*', (req, res, next) => {
  var {param1} = req.params.testVal;
  var {offset} = req.query;
  var {whatever} = req.query;
  
  //res.end(JSON.stringify(param1));
  res.end(whatever);
});

app.get("/checksecret", function (req, res) {
  var env = process.env.DBNAME;
  res.end(env);
});

//Image search extraction layer from Free Code Camp ////
app.get("/api/recent/imagesearch/", imagesearch.recent);
app.get("/api/imagesearch/:query*", imagesearch.search);

//Path to image parser home
app.get("/uaparse", function (request, response) {
  response.sendFile(__dirname + '/views/uaparse.html');
});


//REMEMBER to leave this wildcard at the bottom of all the other app.get paths
app.get("/*", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});