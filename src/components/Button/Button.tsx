import classNames from "classnames";
import styles from "./Button.module.scss";

type Props = {
  text: string;
  onClick: () => void;
  type?: "primary" | "secondary";
  disabled?: boolean;
};

const Button: React.FC<Props> = ({
  text,
  type = "primary",
  disabled,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(styles.button, styles[type])}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
