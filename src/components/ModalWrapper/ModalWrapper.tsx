import React, { ReactNode } from "react";
import styles from "./ModalWrapper.module.scss";
import Modal from "react-modal";
import classNames from "classnames";

type Props = {
  modalOpen: boolean;
  children: ReactNode;
  width?: number;
  height?: number;
};

const ModalWrapper: React.FC<Props> = ({
  modalOpen,
  children,
  height = 200,
  width = 440,
}) => {
  return (
    <Modal
      ariaHideApp={false}
      isOpen={modalOpen}
      style={{
        content: {
          width: `${width}px`,
          height: `${height}px`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        },
        overlay: {
          backgroundColor: "#000000b2",
        },
      }}
    >
      <div className={classNames(styles.modal, "scrollbar")}>{children}</div>
    </Modal>
  );
};

export default ModalWrapper;
