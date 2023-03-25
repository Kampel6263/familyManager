import { ReactNode } from "react";
import Loader from "../Loader/Loader";
import styles from "./Table.module.scss";

type Props = {
  children: ReactNode;
  loading?: boolean;
};

const Table: React.FC<Props> = ({ children, loading }) => {
  return (
    <div className={styles.table}>
      {children}
      {!children && <Loader />}
      {loading && <Loader />}
    </div>
  );
};

export default Table;
