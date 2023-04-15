import React, { ReactNode } from "react";
import styles from "./FormWrapper.module.scss";

type Props = {
  children: ReactNode;
  className: string;
};

const FormWrapper: React.FC<Props> = ({ children, className }) => {
  return (
    <form
      className={styles.className}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </form>
  );
};

export default FormWrapper;
