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
import { v4 as uuidv4 } from "uuid";
import { NO_LABEL_DATA } from "../../../../constants";
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
    .sort((a, b) => b.spend - a.spend);

  const handleAdd = () => {
    if (monthData) {
      const data: CostsDataType = {
        ...monthData,
        labelsData: [
          ...(monthData.labelsData?.map((el) =>
            el.id
              ? el
              : {
                  ...el,
                  id:
                    el.name === NO_LABEL_DATA.name
                      ? NO_LABEL_DATA.id
                      : uuidv4(),
                }
          ) || []),
          { name: labelName, spend: 0, userId: userData.uid, id: uuidv4() },
        ],
      };
      setData({ data, query: DatabaseQueryEnum.FINANCES, teamId: true });
      handleCancel();
    }
  };
  const handleRemove = (id: string) => {
    if (monthData) {
      const labelSum =
        monthData.labelsData?.find((el) => el.id === id)?.spend || 0;
      const data: CostsDataType = {
        ...monthData,
        labelsData: monthData.labelsData
          ?.filter((el) => el.id !== id)
          .map((el) =>
            el.id === NO_LABEL_DATA.id
              ? { ...el, spend: el.spend + labelSum }
              : el
          ),
      };
      setData({ data, query: DatabaseQueryEnum.FINANCES, teamId: true });
    }
  };

  // const handleEdit = () => {
  //   if (monthData) {
  //     const data: CostsDataType = {
  //       ...monthData,
  //       labelsData: monthData.labelsData?.map((el) =>
  //         el.id === editData?.id ? { ...el, name: editData.name } : el
  //       ),
  //     };
  //     setData({ data, query: DatabaseQueryEnum.FINANCES, teamId: true });
  //     setEditData(null);
  //   }
  // };

  const handleCancel = () => {
    setLabelName("");
    setNewLabel(false);
  };

  // const [editData, setEditData] = useState<{ name: string; id: string } | null>(
  //   null
  // );

  return (
    <div className={styles.costsByLabel}>
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
                  disabled={!labelName}
                />
                <Button text="Cancel" onClick={() => handleCancel()} />
              </div>
            </FormWrapper>
          )}
          {filteredData?.map((el) => (
            <div className={styles.item}>
              {/* {editData?.id === el.id ? (
                <div className={styles.edit}>
                  <input
                    value={editData.name}
                    autoFocus={true}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                  <Button
                    onClick={() => handleEdit()}
                    text="Save"
                    type="primary"
                    disabled={!editData.name}
                  />
                  <Button onClick={() => setEditData(null)} text="Cancel" />
                </div>
              ) : ( */}
              <div
                className={styles.name}
                // onClick={() =>
                //   el.id !== NO_LABEL_DATA.id &&
                //   setEditData({ id: el.id, name: el.name })
                // }
              >
                {el.name}
              </div>
              {/* )} */}
              <div>{formatValue(el.spend, "₴")}</div>
              <div>
                {((el.spend / (monthData?.allocatedFunds || 0)) * 100).toFixed(
                  2
                ) || 0}{" "}
                %
              </div>
              <div>
                {el.id !== NO_LABEL_DATA.id && (
                  <Button
                    onClick={() => handleRemove(el.id)}
                    text=""
                    type="remove"
                  />
                )}
              </div>
            </div>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default CostsByLabel;
