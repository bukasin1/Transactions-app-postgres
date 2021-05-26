import postgres from 'postgres';

import env from '../env';

const connectionString = env.require('DATABASE_URL');

const sql = postgres(connectionString);

export default sql;
