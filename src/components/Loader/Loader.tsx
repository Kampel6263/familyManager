import styles from "./Loader.module.scss";
import Animation from "../../assets/globalImgs/Growing flower.gif";
import { useEffect, useState } from "react";
import { LoadingState } from "../../models";
type Props = {
  state: LoadingState;
};

const Loader: React.FC<Props> = ({ state }) => {
  const [message, setMessage] = useState<
    "Loading..." | "This may take a while..." | "No data"
  >("Loading...");

  useEffect(() => {
    if (state === LoadingState.LOADING) {
      const firstTime = 7000;

      const timeout1 = setTimeout(() => {
        setMessage("This may take a while...");
      }, firstTime);

      return () => {
        clearTimeout(timeout1);
      };
    } else if (state === LoadingState.NO_DATA) {
      setMessage("No data");
    }
  }, [state]);

  return state !== LoadingState.LOADED ? (
    <div className={styles.loader}>
      <div className={styles.content}>
        {message !== "No data" && <img src={Animation} alt="" />}
        <span>{message}</span>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Loader;
