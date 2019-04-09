import * as cors from 'cors';
import { Model } from 'mongoose';

export interface AppConfig {
    DB_URI: string;
    CLIENT_URL: string;
    JWT_SECRET: string;
    SOCIAL_CREDENTAILS: {};
    CORS_OPTIONS: cors.CorsOptions;
    DEBUG_MODE: boolean;
}
