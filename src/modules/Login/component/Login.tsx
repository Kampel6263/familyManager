import React from "react";
import styles from "./Login.module.scss";
import googleIcon from "../../../assets/globalImgs/google.png";
type Props = {
  login: () => any;
};

const Login: React.FC<Props> = ({ login }) => {
  return (
    <div className={styles.login}>
      <h3>Login</h3>
      <div className={styles.googleButton} onClick={() => login()}>
        <img src={googleIcon} alt="" />
        <div>Sign in with Google</div>
      </div>
    </div>
  );
};

export default Login;
