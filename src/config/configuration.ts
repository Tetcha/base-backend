export const configuration = () => ({
  port: Number(process.env.PORT) || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '1234',
    name: process.env.DATABASE_NAME || 'base_nest',
  },
});
