const {
    PROD_PORT,
    PROD_NAME,
    PROD_USERNAME,
    PROD_HOST,
    PROD_PASSWORD 
} = process.env

console.log('Running in prod mode')

export default {
    DB_PORT: PROD_PORT,
    DB_NAME: PROD_NAME,
    DB_USERNAME: PROD_USERNAME,
    DB_HOST: PROD_HOST,
    DB_PASSWORD: PROD_PASSWORD
}