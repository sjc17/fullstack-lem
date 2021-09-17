require('dotenv').config();

const config = {};
config.NODE_ENV = process.env.NODE_ENV;

// Will be testing both the cloud DB and local DB here
if (config.NODE_ENV == 'production') {
    config.HOST = process.env.HOST;
    config.PORT = process.env.PORT;
    config.USER = process.env.USER;
    config.PASSWORD = process.env.PASSWORD;
    config.DATABASE = process.env.DATABASE;
    config.CA_CERT = process.env.CA_CERT;
} else {
    config.HOST = process.env.DEV_HOST;
    config.PORT = process.env.DEV_PORT;
    config.USER = process.env.DEV_USER;
    config.PASSWORD = process.env.DEV_PASSWORD;
    config.DATABASE = process.env.DEV_DATABASE;
}

module.exports = config;