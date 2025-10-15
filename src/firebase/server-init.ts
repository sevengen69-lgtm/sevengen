import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { firebaseConfig } from "./config";

// This function is for use on the server only.
export async function initializeFirebaseServer(): Promise<{ app: FirebaseApp }> {
  if (getApps().length > 0) {
    return { app: getApp() };
  }
  const app = initializeApp(firebaseConfig);
  return { app };
}
