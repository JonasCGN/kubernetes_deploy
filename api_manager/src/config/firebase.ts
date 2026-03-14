import admin from 'firebase-admin';
import { ConfigApp } from './config_app';

export function initFirebase() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(ConfigApp.serviceAccount || '{}')),
    });
  }
}