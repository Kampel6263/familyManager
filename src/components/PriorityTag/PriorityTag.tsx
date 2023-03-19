import classNames from "classnames";
import { type } from "os";
import { useEffect, useState } from "react";
import { PriorityEnum } from "../../models";

import styles from "./PriorityTag.module.scss";

type PriorityDataType = {
  label: string;
  value: string;
};

type Props = {
  priority: PriorityEnum;
};

const PriorityTag: React.FC<Props> = ({ priority }) => {
  const [priorityData, setPriorityData] = useState<PriorityDataType>({
    label: "No priority",
    value: "default",
  });
  useEffect(() => {
    switch (priority) {
      case PriorityEnum.VERY_LOW:
        setPriorityData({ label: "Very low", value: "veryLow" });
        break;
      case PriorityEnum.LOW:
        setPriorityData({ label: "Low", value: "low" });
        break;
      case PriorityEnum.MEDIUM:
        setPriorityData({ label: "Medium", value: "medium" });
        break;
      case PriorityEnum.CRITICAL:
        setPriorityData({ label: "Critical", value: "critical" });
        break;
      default:
        setPriorityData({ label: "No priority", value: "default" });
        break;
    }
  }, [priority]);

  return (
    <div className={classNames(styles.tag, styles[priorityData.value])}>
      {priorityData.label}
    </div>
  );
};

export default PriorityTag;
