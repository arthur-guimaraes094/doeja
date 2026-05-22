const http = require('http');

function checkFont() {
  const url = "http://localhost:3001/_next/static/media/b6df7c92285ebcd2-s.0ajnkyhx5vkqi.woff2";
  console.log("Checking font URL:", url);
  http.get(url, (res) => {
    console.log("Response status code:", res.statusCode);
    console.log("Response headers:", res.headers);
  }).on('error', (err) => {
    console.error("Error checking font:", err);
  });
}

checkFont();
