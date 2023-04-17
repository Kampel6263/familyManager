import { useMemo, useState } from "react";
import Table from "../../../../components/Table/Table";
import { formatValue, totalSum } from "../../../../helpers";
import {
  DatabaseQueryEnum,
  LoadingState,
  TeamDataType,
  UserDataType,
  setDataType,
} from "../../../../models";
import { CostsDataType } from "../../models/costs";
import styles from "./Costs.module.scss";
import FormWrapper from "../../../../components/FormWrapper/FormWrapper";
import Button from "../../../../components/Button/Button";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
type Props = {
  selectedMonth: CostsDataType | null;
  userData: UserDataType;
  teamData: TeamDataType;
  setData: (data: setDataType) => void;
};

const Costs: React.FC<Props> = ({
  selectedMonth,
  userData,
  teamData,
  setData,
}) => {
  const [editedItem, setEditedItem] = useState("");

  const [formData, setFormData] = useState<{
    sum?: string;
    comment?: string;
  } | null>(null);

  const handleCancel = () => {
    setFormData(null);
    setEditedItem("");
  };

  const handleSubmit = () => {
    if (selectedMonth?.spendingData) {
      const data: CostsDataType = {
        ...selectedMonth,
        spendingData: selectedMonth.spendingData.map((el) =>
          el.id === editedItem
            ? {
                ...el,
                spendingSum: el.spendingSum + +(formData?.sum || 0),
                spendingHistory: [
                  ...el.spendingHistory,
                  {
                    comment: formData?.comment || "",
                    sum: +(formData?.sum || 0),
                    date: dayjs(new Date()).format("HH:mm, DD/MM/YYYY"),
                    userId: userData.uid,
                    id: uuidv4(),
                  },
                ],
              }
            : el
        ),
      };
      setData({ data, query: DatabaseQueryEnum.FINANCES, teamId: true });
      handleCancel();
    }
  };

  const filteredData = useMemo(
    () =>
      teamData.teamId === userData.uid
        ? selectedMonth?.spendingData
        : selectedMonth?.spendingData.filter((el) =>
            el.userIds ? el.userIds?.includes(userData.uid) : true
          ),
    [selectedMonth?.spendingData, userData]
  );

  if (!selectedMonth?.id) {
    return <div>Select month!</div>;
  }
  const totalBalance =
    totalSum({
      data: selectedMonth.spendingData,
      key: "allocatedSum",
    }) -
    totalSum({
      data: selectedMonth.spendingData,
      key: "spendingSum",
    });
  return (
    <div className={styles.costs}>
      <h2>Costs</h2>
      <Table state={LoadingState.LOADED}>
        <div className={styles.item}>
          <div>Category</div>
          <div>Balance</div>
          <div>Spend</div>
        </div>
        {filteredData?.map((el) =>
          editedItem === el.id ? (
            <FormWrapper className={styles.form}>
              <input
                type="number"
                placeholder="Sum"
                autoFocus
                value={formData?.sum}
                onChange={(e) =>
                  setFormData({ ...formData, sum: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Comment"
                value={formData?.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
              />
              <Button
                onClick={() => handleSubmit()}
                text="Save"
                type="primary"
                nativeType="submit"
                disabled={!formData?.sum}
              />
              <Button text="Cancel" onClick={() => handleCancel()} />
            </FormWrapper>
          ) : (
            <div className={styles.item} onClick={() => setEditedItem(el.id)}>
              <div>{el.categoryName}</div>
              <div>{formatValue(el.allocatedSum - el.spendingSum, "₴")}</div>
              <div>{formatValue(el.spendingSum, "₴")}</div>
            </div>
          )
        )}
        <div className={styles.item}>
          <div>Total</div>
          <div>{formatValue(totalBalance, "₴")}</div>
          <div>
            {formatValue(
              totalSum({
                data: selectedMonth.spendingData,
                key: "spendingSum",
              }),
              "₴"
            )}
          </div>
        </div>
      </Table>
    </div>
  );
};

export default Costs;
