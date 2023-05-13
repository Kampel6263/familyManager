import { useState } from "react";
import Button from "../../../../components/Button/Button";
import Table from "../../../../components/Table/Table";
import {
  LoadingState,
  TeamUserDataType,
  setDataType,
} from "../../../../models";
import AddPassword from "../modals/AddPassword";
import styles from "./Passwords.module.scss";
import { PasswordsDataType } from "../../../../hooks/usePasswordsData";
import dayjs from "dayjs";
import useBcrypt from "../../../../hooks/useBcrypt";
type Props = {
  passwordsData: PasswordsDataType[];
  currentUser: TeamUserDataType;
  setData: (data: setDataType) => void;
};

const Passwords: React.FC<Props> = ({
  currentUser,
  passwordsData,
  setData,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { decryptPass } = useBcrypt();
  return (
    <div>
      <div className={styles.header}>
        <h2>Passwords</h2>
        <Button
          text="+ Add"
          type="primary"
          onClick={() => setModalOpen(true)}
        />
      </div>

      <Table state={LoadingState.LOADED}>
        <div className={styles.item}>
          <div>Name</div>
          <div>Date</div>
          <div>Password</div>
          <div>Action</div>
        </div>
        {passwordsData.map((el) => (
          <div className={styles.item}>
            <div>{el.name}</div>
            <div>{dayjs(el.date).format("DD/MM/YYYY")}</div>
            <div>{decryptPass(el.password)}</div>
            <div>...</div>
          </div>
        ))}
      </Table>
      <AddPassword
        setData={setData}
        modalOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Passwords;
