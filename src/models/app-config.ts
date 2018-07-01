import { Model } from 'mongoose';
import * as cors from 'cors';

export interface AppConfig {
    DB_URI: string;
    CLIENT_URL: string;
    JWT_SECRET: string;
    CORS_OPTIONS: cors.CorsOptions;
    DEBUG_MODE: boolean;
}
