"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_app_1 = require("../config/config_app");
const supabaseUrl = config_app_1.ConfigApp.supabaseUrl;
const supabaseKey = config_app_1.ConfigApp.supabaseAnonKey;
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
