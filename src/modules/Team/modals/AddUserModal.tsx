import { useState } from "react";
import Button from "../../../components/Button/Button";
import ModalWrapper from "../../../components/ModalWrapper/ModalWrapper";
import { TeamUserDataType } from "../../../models";

import styles from "./AddUserModal.module.scss";

type Props = {
  modalOpen: boolean;
  closeModal: () => void;
  addUser: (data: TeamUserDataType) => void;
};

const AddUserModal: React.FC<Props> = ({ modalOpen, closeModal, addUser }) => {
  const [email, setEmail] = useState("");

  const handleCloseModal = () => {
    setEmail("");
    closeModal();
  };

  const handleAdd = () => {
    const data: TeamUserDataType = {
      displayName: "",
      email: email,
      photoURL: "",
      uid: "",
      verified: false,
      owner: false,
    };
    addUser(data);
    handleCloseModal();
  };

  return (
    <ModalWrapper modalOpen={modalOpen} height={112}>
      <div>
        <h3>Add user</h3>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Input email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.buttons}>
            <Button text="Add" onClick={handleAdd} disabled={!email} />
            <Button
              text="Cancel"
              onClick={() => handleCloseModal()}
              type={"secondary"}
            />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddUserModal;
