import classNames from "classnames";
import React from "react";
import { TeamUserDataType } from "../../../../models";
import styles from "./MemberItem.module.scss";
import photoPlaceholder from "../../../../assets/globalImgs/photoPlaceholder.jpg";

type Props = {
  userData: TeamUserDataType;
};

const MemberItem: React.FC<Props> = ({ userData }) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <img src={userData.photoURL || photoPlaceholder} alt="" />
        <div>{userData.displayName || userData.email}</div>
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
