http = require('http');
fs = require('fs');
server = http.createServer( function(req, res) {

    console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
            console.log("Partial body: " + body);
        });
        req.on('end', function () {
            console.log("Body: " + typeof body);
        });
        res.writeHead(200, {'Content-Type': 'text/html','Access-Control-Allow-Origin': '*'});
        res.end('{"status":200,"info":"success","resp":"post received"}');
    }
    else
    {
        console.log("GET");
        var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="text" name="name" /><input type="text" name="name" /> <input type="text" name="name" /><input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
        //var html = fs.readFileSync('index.html');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    }

});

port = 3000;
host = '127.0.0.1';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port); 