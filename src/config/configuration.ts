export const configuration = () => ({
  port: Number(process.env.PORT) || 3000,
  serverUrl: process.env.SERVER_URL || 'http://localhost:4000',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '1234',
    name: process.env.DATABASE_NAME || 'base_nest',
  },
  client: {
    clientRedirectUrl:
      process.env.CLIENT_REDIRECT_URL || 'http://localhost:3000',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expirationTime: Number(process.env.JWT_EXPIRATION_TIME) || 3600,
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_SECRET || '',
  },
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    scope: process.env.FACEBOOK_SCOPE || 'email',
  },
});
