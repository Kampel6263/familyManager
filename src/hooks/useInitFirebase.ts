import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const useInitFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAzKqt1YLS8jlzLYf27QzTaKOPX1IlMka8",
    authDomain: "family-manager-244cc.firebaseapp.com",
    projectId: "family-manager-244cc",
    storageBucket: "family-manager-244cc.appspot.com",
    messagingSenderId: "17654085215",
    appId: "1:17654085215:web:2b231c51dbfea8d1aa4dea",
    measurementId: "G-H3GKYF1263",
  };
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  return { app, analytics };
};

export default useInitFirebase;
