
// import admin from 'firebase-admin';
// import { NotificationPayload } from '../types/notification.d';
// import { initFirebase } from '../config/firebase';

// initFirebase();

// export async function firebaseSendNotification(payload: NotificationPayload) {
//   const message: admin.messaging.TopicMessage = {
//     topic: payload.topic,
//     notification: {
//       title: payload.title,
//       body: payload.message,
//     },
//     android: {
//       priority: "high",
//       notification: {
//         channelId: 'high_importance_channel',
//         sound: 'default',
//       },
//     },
//   };

//   return await admin.messaging().send(message);
// }
