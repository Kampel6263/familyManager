import classNames from "classnames";
import styles from "./Button.module.scss";
import removeIcon from "../../assets/globalImgs/delete-icon.webp";

type Props = {
  text: string;
  onClick: (e?: any) => void;
  type?: "primary" | "secondary" | "remove";
  nativeType?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const Button: React.FC<Props> = ({
  text,
  type = "default",
  nativeType = "button",
  disabled,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(styles.button, styles[type])}
      disabled={disabled}
      type={nativeType}
    >
      {type && type === "remove" ? <img src={removeIcon} alt="" /> : text}
    </button>
  );
};

export default Button;
