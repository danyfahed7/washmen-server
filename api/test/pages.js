var expect  = require('chai').expect;
var request = require('request');

const hostname = 'http://localhost';
const client_port = 3000;

describe ('Status & Content', function() {
it('Main page status', function(done) {
    request(hostname+':'+client_port , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('Main page content', function(done) {
    request(hostname+':'+client_port , function(error, response, body) {
        expect(body).to.equal(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  <script src="/static/js/bundle.js"></script><script src="/static/js/vendors~main.chunk.js"></script><script src="/static/js/main.chunk.js"></script></body>
</html>
`);
        done();
    });
});
});