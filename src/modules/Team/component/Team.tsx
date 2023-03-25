import React, { useState } from "react";
import { TeamDataType, TeamUserDataType, UserDataType } from "../../../models";
import MemberItem from "./MemberItem/MemberItem";
import AddUserModal from "./modals/AddUserModal";
import styles from "./Team.module.scss";

type Props = {
  teamData: TeamDataType;
  userData: UserDataType;
  addUser: (data: TeamUserDataType) => void;
};

const Team: React.FC<Props> = ({ teamData, userData, addUser }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <h3>Team</h3>
      <div className={styles.members}>
        {teamData.users.map((el) => (
          <MemberItem userData={el} />
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
