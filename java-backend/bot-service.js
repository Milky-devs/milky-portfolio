/**
 * Moderation Panel — Java Discord V2 Bot Service Bridge
 * Emulates Java JDA (Java Discord API) & Spring Boot REST Endpoint
 */

const http = require('http');
const https = require('https');

const PORT = 8080;
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1541841811415498933/EEETUjrXpL51QoEv4ouN3tbklIRL5cFDkMzTOpml-bZwweynLsJ5YJ1yUuEDvSxdXUwd';

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', engine: 'Java JDA / Node Bridge', version: '1.0.0' }));
    return;
  }

  if (req.url === '/api/announce' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      console.log('\n[Java Bot Service] Received Announcement Dispatch Request:');
      console.log(body);

      try {
        const payload = JSON.parse(body);
        const webhookUrl = payload.webhookUrl || payload.webhook_url || DISCORD_WEBHOOK_URL;
        delete payload.webhookUrl;
        delete payload.webhook_url;
        
        // Dispatch to Discord API with Java JDA Bot User-Agent header
        const postData = JSON.stringify(payload);
        const urlObj = new URL(webhookUrl);

        const options = {
          hostname: urlObj.hostname,
          path: urlObj.pathname + urlObj.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'DiscordBot (JavaDiscordJDA/5.0, Java 1.8.0_401)'
          }
        };

        const discordReq = https.request(options, discordRes => {
          console.log('[Java Bot Service] Discord API Status Code:', discordRes.statusCode);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'success', discordCode: discordRes.statusCode }));
        });

        discordReq.on('error', err => {
          console.error('[Java Bot Service Error]:', err.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', error: err.message }));
        });

        discordReq.write(postData);
        discordReq.end();

      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  SystemOutPrintln();
});

function SystemOutPrintln() {
  console.log('=================================================');
  console.log('☕ Java Discord V2 Bot API Service started!');
  console.log('Listening on: http://localhost:' + PORT + '/api/announce');
  console.log('Engine: Java SE 8 / JDA v5 Engine');
  console.log('=================================================');
}
