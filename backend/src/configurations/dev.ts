const {DEV_PORT,
    DB_NAME,
    DB_USERNAME,
    DB_HOST,
    DB_PASSWORD} = process.env

    console.log('Running in dev mode')
    export default {
        DB_PORT: DEV_PORT,
        DB_NAME,
        DB_USERNAME,
        DB_HOST,
        DB_PASSWORD
    }