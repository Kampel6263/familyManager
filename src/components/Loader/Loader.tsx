import styles from "./Loader.module.scss";
import Animation from "../../assets/globalImgs/Growing flower.gif";
import { useEffect, useState } from "react";
type Props = {};

const Loader: React.FC<Props> = () => {
  const [message, setMessage] = useState<
    "Loading..." | "This may take some time..." | "No data"
  >("Loading...");

  useEffect(() => {
    const firstTime = 3000;
    const secondTime = 4000;

    const timeout1 = setTimeout(() => {
      setMessage("This may take some time...");
    }, firstTime);
    const timeout2 = setTimeout(() => {
      setMessage("No data");
    }, firstTime + secondTime);
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  return (
    <div className={styles.loader}>
      <div className={styles.content}>
        {message !== "No data" && <img src={Animation} alt="" />}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Loader;
