module.exports = function (request, response) {
  var query = parseInt(request.params.query, 10);
  
  if (!isNaN(query) && query.toString().length === 10) {
    //if it's a 10 digit number
    var type = '10 digit number'
    var date = new Date(query * 1000);
    var unixtime = query;
  } else {
    var type = 'not 10 digit number';
    var date = new Date(request.params.query)
    var unixtime = date.getTime() / 1000;
  }
  var mm = date.getMonth();
  var dd = date.getDate();
  var yyyy = date.getFullYear();  
  
  var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var normietime = !isNaN(unixtime) ? months[mm] + " " + dd + ", " + yyyy : null;

  var arr = {
    'unixtime': unixtime,
    'normietime': normietime
  };
  response.end(JSON.stringify(arr));
}