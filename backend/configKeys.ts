import 'dotenv/config';
import path from 'path';

const configKeys = {
  DATABASE_URL: process.env.DATABASE as string,
  PORT: process.env.PORT as unknown as number,
  XML_API: process.env.XML_API as string,
  BASE_DIR_PATH: path.join(__dirname),
  CORS_URLS: process.env.CORS_URLS as string,
  CLIENT_MAIL: process.env.CLIENT_MAIL as string,
  CLIENT_PASSWORD: process.env.CLIENT_PASSWORD as string,
  MARKETING_MAIL: process.env.MARKETING_MAIL as string,
  SERVER_BASE_URL: process.env.SERVER_BASE_URL as string,
  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_DURATION: process.env.JWT_DURATION as string,
  DO_SPACES_BUCKET: process.env.DO_SPACES_BUCKET as string,
  DO_SPACES_KEY: process.env.DO_SPACES_KEY as string,
  DO_SPACES_SECRET: process.env.DO_SPACES_SECRET as string,
  DO_SPACES_ENDPOINT: process.env.DO_SPACES_ENDPOINT as string,
  DO_SPACES_REGION: process.env.DO_SPACES_REGION as string,
  LOGIN_LIMIT: process.env.LOGIN_LIMIT as unknown as number,
  FILE_BASE_URL: process.env.FILE_BASE_URL as unknown as number,
  DEFAULT_AGENT_MAIL: process.env.DEFAULT_AGENT_MAIL as string,
};

export default configKeys;
