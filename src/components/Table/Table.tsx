import { ReactNode } from "react";
import { LoadingState } from "../../models";
import Loader from "../Loader/Loader";
import styles from "./Table.module.scss";
import classNames from "classnames";

type Props = {
  children: ReactNode;
  state: LoadingState;
  className?: string;
};

const Table: React.FC<Props> = ({ children, state, className }) => {
  if (state === LoadingState.NO_DATA) {
    return <Loader state={state} />;
  }

  return (
    <div className={classNames(styles.table, "scrollbar", className)}>
      {children}
    </div>
  );
};

export default Table;
