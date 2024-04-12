// import mysql, { ResultSetHeader } from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_DATABASE || 'your_default_database_name',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// export const query = async <T = ResultSetHeader>(sql: string, params: any[] = []): Promise<T> => {
//   const [rows] = await pool.execute(sql, params);
//   return rows as T;
// };