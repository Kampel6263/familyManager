import React, { useState } from "react";
import { TeamDataType, TeamUserDataType, UserDataType } from "../../../models";
import AddUserModal from "../modals/AddUserModal";
import MemberItem from "./MemberItem/MemberItem";
import styles from "./Team.module.scss";

type Props = {
  teamData: TeamDataType;
  userData: UserDataType;
  addUser: (data: TeamUserDataType) => void;
};

const Team: React.FC<Props> = ({ teamData, userData, addUser }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const data = [
    teamData.users.find((el) => el.email === userData.email),
    ...teamData.users.filter((el) => el.email !== userData.email),
  ];
  return (
    <div>
      <h2>Team</h2>
      <div className={styles.members}>
        {data.map((el, i) => (
          <MemberItem
            key={el!.email + i}
            userData={el!}
            currentUser={userData}
          />
        ))}
        <div className={styles.add} onClick={() => setModalOpen(true)}>
          + Add user
        </div>
      </div>
      <AddUserModal
        modalOpen={modalOpen}
        addUser={addUser}
        closeModal={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Team;
