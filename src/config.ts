/**
 * This file is responsible for the configurations, it is generated according to the
 *  environment specified in the NODE_ENV environment variable.
 */

import { Document, Model, PaginateModel } from 'mongoose';
import { AppConfig } from './models';
import * as cors from 'cors';

process.env["NODE_CONFIG_DIR"] = __dirname + "/config";
import * as config from 'config';
let exportedConfig = config as AppConfig;

/*
 This file is responsible for the entire configuration of the server.
 */
var isDebugging = false;

// Read the supplied arguments
process.argv.forEach(function(val, index, array) {
  if (val != null && typeof val == 'string') {
    if (val == '-debug') isDebugging = true;
  }
});

if (isDebugging) {
  console.log(`Debug mode is ON`);
}

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
    'x-auth'
  ],
  methods: 'GET,HEAD,POST,OPTIONS,PUT,PATCH,DELETE',
  credentials: true,
  preflightContinue: true
};

exportedConfig = {
  ...exportedConfig,
  CORS_OPTIONS,
  DEBUG_MODE
};


export default exportedConfig;
