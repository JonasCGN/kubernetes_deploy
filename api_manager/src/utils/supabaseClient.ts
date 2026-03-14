import { createClient } from '@supabase/supabase-js';
import { ConfigApp } from '../config/config_app';

const supabaseUrl = ConfigApp.supabaseUrl!;
const supabaseKey = ConfigApp.supabaseAnonKey!;

export const supabase = createClient(supabaseUrl, supabaseKey);