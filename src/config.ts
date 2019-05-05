/**
 * This file is responsible for the configurations, it is generated according to the
 *  environment specified in the NODE_ENV environment variable.
 */

import * as cors from 'cors';
import * as path from 'path';

import { AppConfig } from './models';

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '/config');
const config = require('config');
let exportedConfig = config as AppConfig;

/*
 This file is responsible for the entire configuration of the server.
 */
let isDebugging = false;

// Read the supplied arguments
process.argv.forEach(function(val, index, array) {
  if (val != null && typeof val === 'string') {
    if (val === '-debug') isDebugging = true;
  }
});

const DEBUG_MODE = isDebugging;

const CORS_OPTIONS: cors.CorsOptions = {
  origin: exportedConfig.CLIENT_URL,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authentication',
    'Authorization',
    'x-auth',
    'access_token'
  ],
  methods: 'GET,HEAD,POST,OPTIONS,PUT,PATCH,DELETE',
  credentials: true,
  preflightContinue: true
};

const ENVIRONMENT = process.env['NODE_ENV'] || 'development';

exportedConfig = {
  ...exportedConfig,
  ENVIRONMENT,
  CORS_OPTIONS,
  DEBUG_MODE
};

export default exportedConfig;
