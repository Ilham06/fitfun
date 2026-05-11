import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

const globalForAdmin = globalThis;

function getFirebaseAdmin() {
  if (globalForAdmin._firebaseAdmin) {
    return globalForAdmin._firebaseAdmin;
  }

  if (!admin.apps.length) {
    const filePath = join(process.cwd(), "firebase-service-account.json");
    const serviceAccount = JSON.parse(readFileSync(filePath, "utf8"));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  globalForAdmin._firebaseAdmin = admin;
  return admin;
}

export function sendPushNotification(token, title, body) {
  const adminSdk = getFirebaseAdmin();
  return adminSdk.messaging().send({
    token,
    notification: { title, body },
    webpush: {
      notification: {
        icon: "/images/icon-192.png",
        badge: "/images/icon-72.png",
      },
    },
  });
}

export function sendMulticastPush(tokens, title, body) {
  if (!tokens.length) return Promise.resolve({ successCount: 0 });
  const adminSdk = getFirebaseAdmin();
  return adminSdk.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    webpush: {
      notification: {
        icon: "/images/icon-192.png",
        badge: "/images/icon-72.png",
      },
    },
  });
}

export { getFirebaseAdmin };
