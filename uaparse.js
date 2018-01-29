var forwarded = require('forwarded');

module.exports = 
  function(req, res) {
    var json = {
      ipaddress: forwarded(req)[5] || req.headers.connection.remoteAddress,
      language: req.headers["accept-language"].split(",")[0],
      software: req.headers["user-agent"].match(/\((.*?)\)/)[1]
    }
    res.end(JSON.stringify(req.headers));
  }
