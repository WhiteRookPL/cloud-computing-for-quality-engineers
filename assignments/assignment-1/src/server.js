const http = require("http");
const { Pool } = require("pg");
const Q = require("q");
const metadata = require('node-ec2-metadata');

const configurationFile = require("./config.json");
const configuration = configurationFile.database;

const PORT = process.env.PORT || 8080;
const pool = new Pool({
  user: configuration.user,
  password: configuration.password,
  host: configuration.host,
  port: configuration.port,
  database: configuration.database,
});

const sendErrror = function (res) {
  res.writeHead(500);
  res.end("<html><body><h1>Error!</h1></body></html>");
};

const server = http.createServer(function (req, res) {
  Q.all([
    metadata.getMetadataForInstance("ami-id"),
    metadata.getMetadataForInstance("hostname"),
    metadata.getMetadataForInstance("public-hostname"),
    metadata.getMetadataForInstance("public-ipv4")
  ])
  .spread(function(amiID, hostname, publicHostname, publicIPv4) {
    pool.query("SELECT inet_server_addr(), inet_server_port();", [], (err, result) => {
      if (err) {
        sendErrror(res);
      } else {
        res.writeHead(200);
        res.end(`
          <html>
            <body>
              <h1>Virtual Machine</h1>
              <h2>AMI ID: ${amiID}</h2>
              <h2>Hostname: ${hostname}</h2>
              <h2>Public Hostname: ${publicHostname}</h2>
              <h2>Public IPv4: ${publicIPv4}</h2>
              <hr/>
              <h1>Database</h1>
              <h2>Name: ${JSON.stringify(result.rows)}</h2>
            </body>
          </html>
        `);
      }
    });
  })
  .fail(function(error) {
    sendErrror(res);
  });
});

server.listen(PORT, function () {
  console.info(`HTTP server listens on the port ${PORT}...`);
});
