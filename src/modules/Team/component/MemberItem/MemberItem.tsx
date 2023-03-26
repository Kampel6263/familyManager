import classNames from "classnames";
import React from "react";
import { TeamUserDataType, UserDataType } from "../../../../models";
import styles from "./MemberItem.module.scss";
import photoPlaceholder from "../../../../assets/globalImgs/photoPlaceholder.jpg";

type Props = {
  userData: TeamUserDataType;
  currentUser: UserDataType;
};

const MemberItem: React.FC<Props> = ({ userData, currentUser }) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <img src={userData.photoURL || photoPlaceholder} alt="" />
        <div>
          {userData.displayName || userData.email}
          {currentUser.email === userData.email ? "(You)" : ""}
        </div>
      </div>
      <div
        className={classNames(
          styles.status,
          userData.verified && styles.verified
        )}
      >
        {userData.verified ? "verified" : "not verified"}
      </div>
    </div>
  );
};

export default MemberItem;
