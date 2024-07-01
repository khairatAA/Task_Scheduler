"use strict";
require('dotenv').config(); // If you are using dotenv for environment variables
module.exports = {
    development: {
        dialect: 'postgres', // Specify the dialect here (e.g., postgres, mysql, sqlite, etc.)
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
        // other options...
    },
    // Add configurations for other environments as needed (e.g., production, test)
};
