const { createServer } = require('http');

const PORT = process.env.PORT || 8080;
// Test with for instance curl -X POST -d '{"property": true}' http://localhost:8080
createServer((req, res) => {
  if (req.method === 'POST') {
    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      try {
        const requestData = JSON.parse(data);
        requestData.ourMessage = 'success';
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(requestData));
      } catch (err) {
        res.statusCode = 400;
        res.end('Invalid request');
      }
    });
  } else {
    res.statusCode = 400;
    res.end('Unsupported method - POST JSON');
  }
}).listen(PORT, () => {
  console.log(`Server started on port ${PORT}`); // eslint-disable-line no-console
});
