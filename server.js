let express = require('express');
let path = require('path');
let serveStatic = require('serve-static');
let port = process.env.PORT || 80;

let app = express();

app.use(serveStatic(__dirname + "/dist"));

app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname + "/dist", 'index.html'));
});

app.listen(port);
console.log('server started '+ port);