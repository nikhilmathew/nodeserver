var fs = require('fs');
var actions = {
  'view' : function(user) {
    return '<h1>Todos for ' + user + '</h1>';
  },
   'subscribe' : function(arg){
      console.log(arg);
	return 'got the data'+ arg[0]+arg[1];
}
}

this.dispatch = function(req, res) {

  //some private methods
  var serverError = function(code, content) {
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(content);
  }

  var renderHtml = function(content) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(content, 'utf-8');
  }

  var part = req.url.split('/');
var parts = part[1].split('?');

  if (req.url == "/") {
    fs.readFile('./webroot/index.html', function(error, content) {
      if (error) {
        serverError(500);
      } else {
        renderHtml(content);
      }
    });

  } else {
    var action   = parts[0];
    var argument = parts[1].split('&');

    if (typeof actions[action] == 'function') {
      var content = actions[action](argument);
      renderHtml(content);
    } else {
      serverError(404, '404 Bad Request');
    }
  }
}
