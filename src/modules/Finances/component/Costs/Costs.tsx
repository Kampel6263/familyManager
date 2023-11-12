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
import { useNavigate } from "react-router-dom";
import { TabEnum } from "../../models/main";
import { NO_LABEL_DATA } from "../../../../constants";
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    sum?: string;
    comment?: string;
    label?: string;
  } | null>({ label: NO_LABEL_DATA.name });

  const handleCancel = () => {
    setFormData(null);
    setEditedItem("");
  };

  const handleSubmit = () => {
    if (selectedMonth?.spendingData) {
      const data: CostsDataType = {
        ...selectedMonth,
        lastCostUpdate: {
          ...selectedMonth.lastCostUpdate,
          [userData.uid]: dayjs(new Date()).format("HH:mm, DD/MM/YYYY"),
        },
        labelsData: selectedMonth.labelsData?.map((el) =>
          formData?.label === el.name
            ? { ...el, spend: el.spend + +(formData.sum || 0) }
            : el
        ),
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
                    label: formData?.label,
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
      data: filteredData || [],
      key: "allocatedSum",
    }) -
    totalSum({
      data: filteredData || [],
      key: "spendingSum",
    });
  return (
    <div className={styles.costs}>
      <div className={styles.header}>
        <h2>Costs </h2>
        {selectedMonth.lastCostUpdate[userData.uid] && (
          <div>
            Last update: <b>{selectedMonth.lastCostUpdate[userData.uid]}</b>
          </div>
        )}
      </div>

      <Table state={LoadingState.LOADED} className={styles.table}>
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
              <select
                name="label"
                placeholder="Select label"
                value={formData?.label}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (formData?.sum) {
                      handleSubmit();
                    }
                  }
                }}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              >
                {selectedMonth.labelsData
                  ?.filter((el) => el.userId === userData.uid || !el.userId)
                  .map((el, i) => (
                    <option value={el.name} key={el.name + i}>
                      {el.name}
                    </option>
                  ))}
              </select>
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
              {selectedMonth.selected && (
                <Button
                  text="View"
                  type="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/finances/" + TabEnum.PAYMENTS + "/" + el.id);
                  }}
                />
              )}
            </div>
          )
        )}
        <div className={styles.item}>
          <div>Total</div>
          <div>{formatValue(totalBalance, "₴")}</div>
          <div>
            {formatValue(
              totalSum({
                data: filteredData || [],
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
