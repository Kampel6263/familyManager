import React, { useEffect, useState } from "react";
import styles from "./Security.module.scss";
import {
  DatabaseQueryEnum,
  TeamDataType,
  TeamUserDataType,
  UserDataType,
  setDataType,
} from "../../../models";
import PinManageModal from "./modals/PinManageModal";
import { PinModalType, SecurityTabs } from "../models/main";
import { boolean } from "yup";
import PinCheckModal from "./modals/PinCheckModal";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import Passwords from "./Passwords/Passwords";
import { PasswordsDataType } from "../../../hooks/usePasswordsData";

type Props = {
  teamData: TeamDataType;
  userData: UserDataType;
  passwordsData: PasswordsDataType[];
  setData: (data: setDataType) => void;
};

const Security: React.FC<Props> = ({
  userData,
  teamData,
  passwordsData,
  setData,
}) => {
  const currentUser = teamData.users.find((el) => el.uid === userData.uid)!;
  const [pinModalType, setPinModalType] = useState<PinModalType | null>(null);
  const navigate = useNavigate();
  const [pinSucces, setPinSucces] = useState(false);
  const { tab } = useParams();
  useEffect(() => {
    if (currentUser?.uid && !currentUser.pin) {
      setPinModalType(PinModalType.CREATE);
    } else {
      setPinModalType(null);
      if (
        currentUser?.uid &&
        dayjs(new Date()).format("YYYY/MM/DD") !== currentUser?.lastIncorrectTry
      ) {
        const data: TeamDataType = {
          ...teamData,
          users: teamData.users.map((el) =>
            el.uid === currentUser.uid
              ? { ...el, attempts: 3, lastIncorrectTry: null }
              : el
          ),
        };
        setData({ data, query: DatabaseQueryEnum.TEAMS });
      }
    }
  }, [currentUser?.pin, currentUser?.lastIncorrectTry]);
  const tabs: {
    label: string;
    path: string;
  }[] = [
    {
      label: "Passwords",
      path: SecurityTabs.PASSWORDS,
    },
  ];

  console.log(pinSucces, "pin ");

  return (
    <div>
      {pinSucces && (
        <div>
          <div className={styles.tabs}>
            {tabs.map((tabItem) => (
              <div
                onClick={() => navigate("/security/" + tabItem.path)}
                className={classNames(
                  styles.tab,
                  tabItem.path === tab && styles.active
                )}
              >
                {tabItem.label}
              </div>
            ))}
          </div>
          {tab === SecurityTabs.PASSWORDS && (
            <Passwords
              currentUser={currentUser}
              setData={setData}
              passwordsData={passwordsData}
            />
          )}
        </div>
      )}
      <PinCheckModal
        modalOpen={!pinModalType && !pinSucces}
        currentUser={currentUser!}
        setData={setData}
        teamData={teamData}
        funk={setPinSucces}
      />
      <PinManageModal
        type={pinModalType}
        teamData={teamData}
        currentUser={currentUser!}
        setData={setData}
      />
    </div>
  );
};

export default Security;
