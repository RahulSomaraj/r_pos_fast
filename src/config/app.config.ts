import { registerAs } from '@nestjs/config';

export default registerAs('APP_CONFIG', () => ({
  PORT: process.env.PORT || 5000,
  TOKEN_KEY: process.env.TOKEN_KEY || '',
}));
