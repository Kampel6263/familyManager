import { FC, useMemo, useState } from "react";
import Button from "../../../../components/Button/Button";
import Table from "../../../../components/Table/Table";
import {
  DatabaseQueryEnum,
  LoadingState,
  UserDataType,
  setDataType,
} from "../../../../models";
import styles from "./CostsByLabel.module.scss";
import classNames from "classnames";
import FormWrapper from "../../../../components/FormWrapper/FormWrapper";
import { CostsDataType } from "../../models/costs";
import { formatValue } from "../../../../helpers";

type Props = {
  monthData: CostsDataType | null;
  userData: UserDataType;
  isAdmin: boolean;
  selectedUsers: string[];
  setData: (data: setDataType) => void;
};

const CostsByLabel: FC<Props> = ({
  monthData,
  userData,
  isAdmin,
  selectedUsers,
  setData,
}) => {
  const [newLabel, setNewLabel] = useState(false);

  const [labelName, setLabelName] = useState("");

  const filteredData = monthData?.labelsData
    ?.filter((el) => {
      if (!el.userId) {
        return true;
      }
      if (isAdmin) {
        return selectedUsers.length ? selectedUsers.includes(el.userId) : true;
      } else {
        return el.userId === userData.uid;
      }
    })
    .sort((a, b) => a.spend - b.spend);

  const handleAdd = () => {
    if (monthData) {
      const data: CostsDataType = {
        ...monthData,
        labelsData: [
          ...(monthData.labelsData || []),
          { name: labelName, spend: 0, userId: userData.uid },
        ],
      };
      setData({ data, query: DatabaseQueryEnum.FINANCES, teamId: true });
      handleCancel();
    }
  };
  const handleCancel = () => {
    setLabelName("");
    setNewLabel(false);
  };
  return (
    <div>
      <div className={styles.header}>
        <h2>Labels</h2>
        <Button
          onClick={() => setNewLabel(true)}
          text="+ Add label"
          type="primary"
        />
      </div>
      <div>
        <Table state={LoadingState.LOADED} className={styles.table}>
          <div className={styles.item}>
            <div>Label</div>
            <div>Spend</div>
            <div>Spending, %</div>
          </div>
          {newLabel && (
            <FormWrapper className={classNames(styles.item)}>
              <input
                type="text"
                autoFocus
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
              />
              <div className={styles.buttons}>
                <Button
                  onClick={() => handleAdd()}
                  text="Save"
                  type="primary"
                  nativeType="submit"
                />
                <Button text="Cancel" onClick={() => handleCancel()} />
              </div>
            </FormWrapper>
          )}
          {filteredData?.map((el) => (
            <div className={styles.item}>
              <div>{el.name}</div>
              <div>{formatValue(el.spend, "₴")}</div>
              <div>
                {((el.spend / (monthData?.allocatedFunds || 0)) * 100).toFixed(
                  2
                ) || 0}{" "}
                %
              </div>
            </div>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default CostsByLabel;
