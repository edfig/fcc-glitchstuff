//mongodb uri mongodb://<dbuser>:<dbpassword>@ds259305.mlab.com:59305/edfigdb
var mongodb = require('mongodb');
var db = process.env.DB;
var uri = 'mongodb://'+'dbadmin'+':'+process.env.DBPW+'@'+process.env.DBHOST+':'+process.env.DBPORT+'/'+db;
//var uri = 'mongodb://'+process.env.DBUSER+':'+process.env.DBPASS+'@'+process.env.DBHOST+':'+process.env.DBPORT+'/'+process.env.DB;

function createNew(doc) {
  mongodb.MongoClient.connect(uri, function(err, db) {
    if (err) console.log(err);  else  console.log("connected to mongodb: " + process.env.DB);
    var storedUrls = db.collection('shortyurl');
    storedUrls.insert(doc);
    console.log("added " + doc + "to " + db);
    db.close();
  });
}



module.exports = {
  newUrl: function (req, res) {
    var url = req.params.query; //parseInt(req.params.query, 10);
    var entry = {"original_url":url, "short_url":"abc"};
    
    //check whether it is a valid url
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if (!url.match(regex)) {
      res.end('invalid url')
    }

    //start mongodb stuff
    mongodb.MongoClient.connect(uri, function(err, db) {
      if (err) console.log(err);
      var storedUrls = db.collection('shortyurl');
      
      //assign shortycode. It will be an incremented integer, tracked in it's own mongodb doc. Tracker's ID is 5a0797e5734d1d68d42ddbad 
      var currentCode;
      storedUrls.find({"codeTracker": "yes"}, {_id: 0, currentCode: 1}).toArray(function(err, docs) {
        if (err) throw err;
        var currentCode = parseInt(docs[0].currentCode) + 1;
        storedUrls.update({"codeTracker": "yes"},{$set:{'currentCode':currentCode}});
        entry.shortycode = docs[0].currentCode; 
      });
      
       //check whether the url already exists 
      storedUrls.findOne({original_url:url}, function(err, result) {
        if (err) throw err;
        //if it exists, just tell the user and do nothing else
        if (result) {
          res.end('already existed in db: ' + JSON.stringify(result));
          db.close();
        } else {
        //if it doesn't already exist, create the new one
          storedUrls.insert(entry);
          res.end(url + ' is new, creating: ' + JSON.stringify(entry));
          db.close();
        }
      });
    });  
    
    //if the url exists, store it in the database and return an object that looks like this: { "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" }
    //createNew(entry);
    //res.end(JSON.stringify(entry)); 
  },
  
  redirect: function(req, res) {
    var query = req.params.query;//parseInt(req.params.query, 10);
    //check whether the code exists in the db
    mongodb.MongoClient.connect(uri, function(err, db) {
      var storedUrls = db.collection('shortyurl');
      storedUrls.findOne({shortycode:103}, function(err, result) {
        if (err) throw err;
        //if it exists, just tell the user and do nothing else
        if (result) {
          res.end(JSON.stringify(result));
          db.close();
        } else {
        //if it doesn't already exist, display not found
          res.end('not found');
          db.close();
        }
      });
      
    })
    
    //res.end("not found"); 
  }
   
}