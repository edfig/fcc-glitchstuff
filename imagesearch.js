var mongodb = require('mongodb');
//var uri = 'mongodb://dbadmin'+process.env.DBPW2+'@ds117848.mlab.com:17848/edfgdb2';
var uri = 'mongodb://dbadmin:'+process.env.DBPW2+'@ds117848.mlab.com:17848/edfgdb2';

function search(req, res) {


  //'use strict';

  let https = require('https');

  // Replace the bing subscriptionKey string value with your valid subscription key.
  let subscriptionKey = process.env.BINGKEY1;

  // Verify the bing endpoint URI.  At this writing, only one endpoint is used for Bing
  // search APIs.  In the future, regional endpoints may be available.  If you
  // encounter unexpected authorization errors, double-check this host against
  // the endpoint for your Bing Web search instance in your Azure dashboard.
  let host = 'api.cognitive.microsoft.com';
  let path = '/bing/v7.0/images/search'; //Inserted /images/ for image filter
  let term = req.params.query;//'Microsoft Cognitive Services';
  
  //offset stuff...
  let {offset} = req.query; 
  if (offset == null) {offset = 0};
  
  //store the request query into mongo
  mongodb.MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    console.log('connecting to db..');
    const searches = db.collection('searchhistory');
    let d = new Date();
    let datetimeString = d.toISOString();
    let searchHist = {'date/time':datetimeString, 'query':term};
    
    searches.insert(searchHist, function(err, result) {
      if(err) throw err;
      console.log('stored ' + term + ' in db at time: ' + datetimeString);
    });

    db.close(function(err) {
      if (err) throw err;
    });
  });

  let response_handler = function (response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    })
    response.on('end', function() {
      var obj = JSON.parse(body);
      var results = [];
      //take only what I need from the object: url, snippet, thumbnail, context
      for  (var i in obj.value) {
        console.log(i);
        console.log(obj.value[i].name);
        results[i] = {'url':obj.value[i].contentUrl, 'snippet':obj.value[i].name, 'thumbnail':obj.value[i].thumbnailUrl, 'context':obj.value[i].hostPageUrl};
      }
      
      
      //let picked = (({ name, contentUrl }) => ({ name, contentUrl }))(obj[0]);
      
      res.end(JSON.stringify(results));
      //res.end(JSON.stringify(obj.value));
    })


      response.on('error', function (e) {
          console.log('Error: ' + e.message);
      });
  };

  let bing_web_search = function (search) {
    console.log('Searching the Web for: ' + term);
    let request_params = {
          method : 'GET',
          hostname : host,
          path : path + '?q=' + encodeURIComponent(search) + '&count=10&offset=' + offset,
          headers : {
              'Ocp-Apim-Subscription-Key' : subscriptionKey,
          }
      };

      //let req = https.request(request_params, show_results)//response_handler);
      let req = https.request(request_params, response_handler);
      req.end();
  }

  if (subscriptionKey.length === 32) {
      bing_web_search(term);
  } else {
      console.log('Invalid Bing Search API subscription key!');
      console.log('Please paste yours into the source code.');
  }
}

function recent (req, res) {
  mongodb.MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    console.log('connecting to db..');
    const searches = db.collection('searchhistory');
    searches.find({}).toArray(function(err, docs){
      if (err) throw err;
      res.end(JSON.stringify(docs));
    });

    db.close(function(err) {
      if (err) throw err;
    });
  });  
  //res.end('i do nothing');
}


module.exports = { 
  search: search,
  recent: recent
}