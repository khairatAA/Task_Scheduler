require('dotenv').config(); // Ensure .env variables are loaded

module.exports = {
    development: {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    },
    production: {
        dialect: 'postgres',
        host: process.env.PROD_HOST,
        username: process.env.PROD_USERNAME,
        password: process.env.PROD_PASSWORD,
        database: process.env.PROD_NAME,
        port: process.env.PROD_PORT,
    },
    // Add configurations for other environments as needed (e.g., test)
};
