import { useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

type Props = {
  app: any;
};

const useAuth = ({ app }: Props) => {
  const auth = getAuth(app);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const subscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return subscribe;
  });

  const login = () => {
    signInWithPopup(auth, new GoogleAuthProvider()).then((credential) => {
      setUser(credential.user);
    });
  };

  const logout = () => signOut(auth);

  return { user, login, logout };
};

export default useAuth;
