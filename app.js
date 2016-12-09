
var http = require('http');
var querystring = require('querystring');
var utils = require('util');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/subscribers';
MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

http.createServer(function (req, res) {
  // set up some routes
  console.log(req.url);
  switch (req.url) {
    case '/':
      console.log("[200] " + req.method + " to " + req.url);
      res.writeHead(200, "OK", { 'Content-Type': 'text/html' });
      res.write('<html><head><title>Hello Noder!</title></head><body>');
      res.write('<h1>Welcome Noder, who are you?</h1>');
      res.write('<form enctype="application/x-www-form-urlencoded" action="/subscribe" method="post">');
      res.write('Name: <input type="text" name="username" value="John Doe" /><br />');
      res.write('Age: <input type="text" name="userage" value="99" /><br />');
      res.write('<input type="submit" />');
      res.write('</form></body></html');
      res.end();
      break;
    case '/subscribe':
      if (req.method == 'POST') {
        console.log("[200] " + req.method + " to " + req.url);
        var fullBody = '';


        req.on('data', function (chunk) {
          console.log("Received body data:");
          console.log(chunk.toString);
          fullBody += chunk.toString();
        });

        req.on('end', function () {
          // empty 200 OK response for now
          res.writeHead(200, "OK", { 'Content-Type': 'text/html','Access-Control-Allow-Origin': '*' });
          var decodedBody = querystring.parse(fullBody);

          // output the decoded data to the HTTP response   
          var data;       
          res.write('<html><head><title>Post data</title></head><body><pre>');
          var temp=(utils.inspect(decodedBody).split('\''));
          data=JSON.parse(temp[1]);
          console.log(typeof data);
          res.write('data received at this end');
          res.write('</pre></body></html>');
          res.end();
          MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log(data.name, data.email);
            insertDocument(db,data.name,data.email, function () {
              db.close();
            });
          });
        });

      } else {
        console.log("[405] " + req.method + " to " + req.url);
        res.writeHead(405, "Method not supported", { 'Content-Type': 'text/html' });
        res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
      }
      break;
    default:
      res.writeHead(404, "Not found", { 'Content-Type': 'text/html' });
      res.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
      console.log("[404] " + req.method + " to " + req.url);
  };
}).listen(54920); // listen on tcp port 8080 (all interfaces)
console.log("listening on port 54920");

var insertDocument = function (db, name, email, callback) {
  //console.log(name + email);
  db.subscribers.update({
    "Email": email
  }, {
    "Name": name,
    "Email": email
  }, {upsert:true});
};