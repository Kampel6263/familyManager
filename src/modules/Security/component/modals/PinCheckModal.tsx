import { useState } from "react";
import Button from "../../../../components/Button/Button";
import ModalWrapper from "../../../../components/ModalWrapper/ModalWrapper";
import styles from "./modal.module.scss";
import useBcrypt from "../../../../hooks/useBcrypt";
import {
  DatabaseQueryEnum,
  TeamDataType,
  TeamUserDataType,
  setDataType,
} from "../../../../models";
import dayjs from "dayjs";
import useNotify from "../../../../hooks/useNotify";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { SecurityTabs } from "../../models/main";

type Props = {
  modalOpen: boolean;

  funk: (res: boolean) => void;

  teamData: TeamDataType;
  currentUser: TeamUserDataType;
  setData: (data: setDataType) => void;
};

const PinCheckModal: React.FC<Props> = ({
  modalOpen,
  currentUser,
  teamData,
  setData,
  funk,
}) => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const { matchPass } = useBcrypt();
  const { notify } = useNotify();
  const manager = (res: boolean) => {
    if (res) {
      const data: TeamDataType = {
        ...teamData,
        users: teamData.users.map((el) =>
          el.uid === currentUser.uid
            ? {
                ...el,
                attempts: 3,
                lastIncorrectTry: null,
              }
            : el
        ),
      };
      setData({ data, query: DatabaseQueryEnum.TEAMS });
      funk(true);
      navigate("/security/" + SecurityTabs.PASSWORDS);
    } else {
      notify({ text: "Incorrect PIN", type: "error" });
      const data: TeamDataType = {
        ...teamData,
        users: teamData.users.map((el) =>
          el.uid === currentUser.uid
            ? {
                ...el,
                attempts: (el.attempts || 3) - 1,
                lastIncorrectTry: dayjs(new Date()).format("YYYY/MM/DD"),
              }
            : el
        ),
      };
      setData({ data, query: DatabaseQueryEnum.TEAMS });
    }
  };

  const handleEnter = () => {
    manager(
      matchPass({
        password: pin,
        hashedPassword: currentUser.pin,
      })
    );
  };

  return (
    <ModalWrapper modalOpen={modalOpen} height={173} width={300}>
      <div className={styles.pinCheck}>
        <h3>Input PIN</h3>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          disabled={currentUser.attempts === 0}
        />

        <span
          className={classNames(
            styles.error,
            currentUser.attempts === 3 && styles.empty
          )}
        >
          {currentUser.attempts === 0
            ? "You have no more attempts, try again later"
            : `You have ${currentUser.attempts} attempt(s) left`}{" "}
        </span>

        <Button
          text={currentUser.attempts === 0 ? "Ok" : "Enter"}
          onClick={
            currentUser.attempts === 0 ? () => navigate(-1) : handleEnter
          }
          type="primary"
        />
      </div>
    </ModalWrapper>
  );
};

export default PinCheckModal;
