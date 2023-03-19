import styles from "./Header.module.scss";
import LogoImg from "../../assets/globalImgs/logo.png";

type Props = {};

const Header: React.FC<Props> = () => {
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <img src={LogoImg} alt="" />
        <div>Name</div>
      </div>
    </div>
  );
};
export default Header;
