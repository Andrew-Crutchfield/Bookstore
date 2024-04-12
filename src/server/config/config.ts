// import dotenv from 'dotenv';
// dotenv.config();

// const mysql = {
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
// };

// if (!mysql.user || !mysql.password || !mysql.host || !mysql.database) {
//     throw new Error('Crashing app - missing MySQL variables');
// }

// const jwt = {
//     secret: process.env.JWT_SECRET as string,
//     expiration: process.env.JWT_EXPIRATION as string,
// };

// if (!jwt.secret || !jwt.expiration) {
//     throw new Error('Crashing app - missing JWT variables');
// }

// export default {
//     mysql,
//     jwt,
// };