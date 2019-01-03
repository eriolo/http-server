const { createServer } = require('http');
const querystring = require('querystring');
const url = require('url');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

// Simple web server
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
createServer((req, res) => {
  const URL = req.url;
  const { query } = url.parse(URL, true);
  const queryString = querystring.stringify(query);
  const urlWithoutQuery = URL.replace(queryString, '').replace(/\?/, '');
  const pathname = replaceSlash(urlWithoutQuery);

  // Redirect url with trailing slash and no queries
  // to the url without trailing slash
  if (/\/$/.test(urlWithoutQuery) && urlWithoutQuery !== '/') {
    res.writeHead(301, { Location: pathname });
    return res.end();
  }

  let filePath = `./pages${pathname}/index.html`;

  // Search for url on file system
  fs.readFile(filePath, (err, content) => {
    // Error 'no such file or directory'
    if (err && err.code === 'ENOENT') {
      fs.readFile('./pages/404/index.html', (err, content) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      });
    } else if (err) {
      res.writeHead(500);
      res.end(`Error code ${err.code}`);
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    }
  });
}).listen(PORT, () => {
  console.log(`Server started on port ${PORT}`); // eslint-disable-line no-console
});

const replaceSlash = url => url.replace(/\/$/, '');
