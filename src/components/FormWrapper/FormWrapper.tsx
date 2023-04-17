import React, { ReactNode } from "react";
import styles from "./FormWrapper.module.scss";

type Props = {
  children: ReactNode;
  className?: string;
  onSubmit?: () => void;
};

const FormWrapper: React.FC<Props> = ({ children, onSubmit, className }) => {
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit();
      }}
    >
      {children}
    </form>
  );
};

export default FormWrapper;
