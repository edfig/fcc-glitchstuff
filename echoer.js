module.exports = function(req, res) {
  var query = req.params.query;//parseInt(req.params.query, 10);
  res.end(query);  
}
