const winston = require("winston");
const Q = require("q");
const metadata = require('node-ec2-metadata');

const LEVELS = [
  "error",
  "warn",
  "info",
  "verbose",
  "debug",
  "silly"
];

const logger = winston.createLogger({
  level: "debug",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "combined.log" })
  ]
});

const randomFromRange = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const randomFromArray = function(array) {
  return array[randomFromRange(0, array.length)];
}

const log = (values) => {
  const randomTimeout = randomFromRange(100, 1000);

  const level = randomFromArray(LEVELS);
  const message = randomFromArray(values);

  setTimeout(
    () => {
      logger.log({ level, message });
      log(values);
    },
    randomTimeout
  );
};

Q.all([
  metadata.getMetadataForInstance("ami-id"),
  metadata.getMetadataForInstance("hostname"),
  metadata.getMetadataForInstance("public-hostname"),
  metadata.getMetadataForInstance("public-ipv4")
])
.spread(function(amiID, hostname, publicHostname, publicIPv4) {
  const values = [
    `AMI: ${amiID}`,
    `Hostname: ${hostname}`,
    `Public Hostname: ${publicHostname}`,
    `Public IPv4: ${publicIPv4}`,
  ];

  log(values);
});
