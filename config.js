require('dotenv').config();

const config = {};
config.NODE_ENV = process.env.NODE_ENV;

// Will be testing both the cloud DB and local DB here
if (config.NODE_ENV == 'production') {
    config.HOST = process.env.DBHOST;
    config.PORT = process.env.DBPORT;
    config.USER = process.env.DBUSER;
    config.PASSWORD = process.env.DBPASSWORD;
    config.DATABASE = process.env.DBDATABASE;
    config.CA_CERT = process.env.CA_CERT;
} else {
    config.HOST = process.env.DBDEV_HOST;
    config.PORT = process.env.DBDEV_PORT;
    config.USER = process.env.DBDEV_USER;
    config.PASSWORD = process.env.DBDEV_PASSWORD;
    config.DATABASE = process.env.DBDEV_DATABASE;
}

module.exports = config;