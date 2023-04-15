import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const useInitFirebase = () => {
  const dev = window.location.hostname === "localhost";

  const firebaseConfig = {
    apiKey: dev
      ? process.env.REACT_APP_API_KEY_DEV
      : process.env.REACT_APP_API_KEY,
    authDomain: dev
      ? process.env.REACT_APP_AUTH_DOMAIN_DEV
      : process.env.REACT_APP_AUTH_DOMAIN,
    projectId: dev
      ? process.env.REACT_APP_PROJECT_ID_DEV
      : process.env.REACT_APP_PROJECT_ID,
    storageBucket: dev
      ? process.env.REACT_APP_STORAGE_BUCKET_DEV
      : process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: dev
      ? process.env.REACT_APP_MESSAGING_SENDER_ID_DEV
      : process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: dev ? process.env.REACT_APP_ID_DEV : process.env.REACT_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  return { app, analytics };
};

export default useInitFirebase;
