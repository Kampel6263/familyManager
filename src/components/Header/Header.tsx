import styles from "./Header.module.scss";
import LogoImg from "../../assets/globalImgs/logo.png";
import { UserDataType } from "../../models";
import Button from "../Button/Button";
import photoPlaceholder from "../../assets/globalImgs/photoPlaceholder.jpg";
import { useState } from "react";
import classNames from "classnames";

type Props = {
  userData: UserDataType | null;
  logout: () => any;
};

const Header: React.FC<Props> = ({ userData, logout }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <img src={LogoImg} alt="" />

        <div
          className={styles.userData}
          onClick={() => setShowPopup(!showPopup)}
        >
          <span>{userData?.displayName || "Anonumys"}</span>
          <img src={userData?.photoURL || photoPlaceholder} alt="" />

          <div className={classNames(styles.popup, showPopup && styles.active)}>
            <Button text="Logout" onClick={() => logout()} type={"primary"} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
