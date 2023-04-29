import styles from "./Header.module.scss";
import LogoImg from "../../assets/globalImgs/logo.png";
import { UserDataType } from "../../models";
import Button from "../Button/Button";
import photoPlaceholder from "../../assets/globalImgs/photoPlaceholder.jpg";
import { useState } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

type Props = {
  userData: UserDataType | null;
  logout: () => any;
};

const Header: React.FC<Props> = ({ userData, logout }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <img src={LogoImg} alt="" />
          <div className={styles.back} onClick={() => navigate(-1)}>
            &larr; Back
          </div>
        </div>

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
