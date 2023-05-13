import { useState } from "react";
import Button from "../../../../components/Button/Button";
import FormWrapper from "../../../../components/FormWrapper/FormWrapper";
import ModalWrapper from "../../../../components/ModalWrapper/ModalWrapper";
import styles from "./modal.module.scss";
import useBcrypt from "../../../../hooks/useBcrypt";
import {
  DatabaseQueryEnum,
  TeamUserDataType,
  setDataType,
} from "../../../../models";

import { PasswordsDataType } from "../../../../hooks/usePasswordsData";
import dayjs from "dayjs";

type Props = {
  currentUser: TeamUserDataType;
  modalOpen: boolean;
  closeModal: () => void;
  setData: (data: setDataType) => void;
};

const AddPassword: React.FC<Props> = ({
  currentUser,
  modalOpen,
  setData,
  closeModal,
}) => {
  const [formData, setFormData] = useState({ name: "", password: "" });

  const { encryptPass } = useBcrypt();
  const handleClose = () => {
    setFormData({ name: "", password: "" });
    closeModal();
  };
  const handleSubmit = () => {
    const data: PasswordsDataType = {
      date: dayjs(new Date()).format("YYYY/MM/DD"),
      name: formData.name,
      password: encryptPass(formData.password),
      userId: currentUser.uid,
      private: true,
      id: "",
    };
    setData({ data, query: DatabaseQueryEnum.PASSWORDS, teamId: true });
    handleClose();
  };

  return (
    <ModalWrapper modalOpen={modalOpen} height={207}>
      <div className={styles.addPassword}>
        <h3>Add</h3>
        <FormWrapper onSubmit={() => handleSubmit()} className={styles.form}>
          <input
            placeholder="Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="name"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <div className={styles.buttons}>
            <Button text="Save" nativeType="submit" />
            <Button
              text="Cancel"
              type="secondary"
              onClick={() => handleClose()}
            />
          </div>
        </FormWrapper>
      </div>
    </ModalWrapper>
  );
};

export default AddPassword;
