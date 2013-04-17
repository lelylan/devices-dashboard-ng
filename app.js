var express = require("express");
var app = express();

app.configure(function(){
  app.use(express.static(__dirname + '/dist'));
});

app.all('/*', function(req, res) {
  res.sendfile('index.html', { root: __dirname + '/dist' });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode");
