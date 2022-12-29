import mysql from 'mysql2'
import databaseConfig from '../config/database';

export default mysql.createConnection(databaseConfig);