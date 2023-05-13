import { useState } from "react";
import ModalWrapper from "../../../../components/ModalWrapper/ModalWrapper";
import bcrypt from "bcryptjs";
import Button from "../../../../components/Button/Button";
import styles from "./modal.module.scss";
import { PinModalType } from "../../models/main";
import useNotify from "../../../../hooks/useNotify";
import useBcrypt from "../../../../hooks/useBcrypt";
import {
  DatabaseQueryEnum,
  TeamDataType,
  TeamUserDataType,
  setDataType,
} from "../../../../models";
import FormWrapper from "../../../../components/FormWrapper/FormWrapper";
type Props = {
  type: PinModalType | null;
  teamData: TeamDataType;
  currentUser: TeamUserDataType;
  setData: (data: setDataType) => void;
};

const PinManageModal: React.FC<Props> = ({
  type,
  teamData,
  currentUser,
  setData,
}) => {
  const [PIN, setPIN] = useState<{ first: string; second: string }>({
    first: "",
    second: "",
  });

  const { notify } = useNotify();

  const { encryptPass } = useBcrypt();

  const savePin = (hash: string) => {
    const data: TeamDataType = {
      ...teamData,
      users: teamData.users.map((el) =>
        el.uid === currentUser.uid
          ? { ...el, pin: hash, attempts: 3, lastIncorrectTry: null }
          : el
      ),
    };
    setData({ query: DatabaseQueryEnum.TEAMS, data });
  };

  const handleSubmit = () => {
    if (PIN.first.replaceAll(" ", "").length < 4) {
      return notify({
        type: "error",
        text: "Pin must contain more than 4 characters",
      });
    }
    if (PIN.first !== PIN.second) {
      return notify({
        text: "Pins do not match",
        type: "error",
      });
    }
    savePin(encryptPass(PIN.first));
  };

  return (
    <ModalWrapper modalOpen={!!type} height={237}>
      <div className={styles.pinManage}>
        <h3>{type === PinModalType.CREATE ? "Create pin" : "Change pin"} </h3>
        <FormWrapper onSubmit={() => handleSubmit()}>
          <div className={styles.pinBlock}>
            <label htmlFor="firstPin">Input PIN</label>
            <input
              id="firstPin"
              type="password"
              value={PIN.first}
              onChange={(e) => setPIN({ ...PIN, first: e.target.value })}
              autoComplete="false"
            />
          </div>
          <div className={styles.pinBlock}>
            <label htmlFor="secondPin">Input PIN again</label>
            <input
              id="secondPin"
              type="password"
              value={PIN.second}
              onChange={(e) => setPIN({ ...PIN, second: e.target.value })}
              autoComplete="false"
            />
          </div>

          <Button
            text="Create"
            // onClick={handleSubmit}
            nativeType="submit"
            type="primary"
          />
        </FormWrapper>
      </div>
    </ModalWrapper>
  );
};

export default PinManageModal;
