import { useNavigate, useParams } from "react-router-dom";
import styles from "./Costs.module.scss";
import { CostsDataType, SpendingDataType } from "../../models/costs";
import { useEffect, useState } from "react";
import Table from "../../../../components/Table/Table";
import {
  DatabaseQueryEnum,
  LoadingState,
  TeamDataType,
  UserDataType,
  setDataType,
} from "../../../../models";

import { formatValue } from "../../../../helpers";
import { TabEnum } from "../../models/main";
import ModalWrapper from "../../../../components/ModalWrapper/ModalWrapper";
import FormWrapper from "../../../../components/FormWrapper/FormWrapper";
import Button from "../../../../components/Button/Button";

type Props = {
  selectedMonth: CostsDataType | null;
  teamData: TeamDataType;
  userData: UserDataType;
  setData: (data: setDataType) => void;
};

const Payments: React.FC<Props> = ({
  selectedMonth,
  teamData,
  userData,
  setData,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spendingData, setSpendingData] = useState<SpendingDataType | null>(
    null
  );

  const [editedData, setEditedData] = useState<{
    comment: string;
    label: string;
    sum: string;
    id: string;
  } | null>(null);

  const handleEditComment = () => {
    if (selectedMonth) {
      const oldData = spendingData?.spendingHistory.find(
        (el) => el.id === editedData?.id
      );

      const data: CostsDataType = {
        ...selectedMonth,
        labelsData:
          oldData?.label !== editedData?.label
            ? selectedMonth.labelsData?.map((el) => {
                if (el.name === oldData?.label) {
                  return { ...el, spend: el.spend - oldData.sum };
                }
                if (el.name === editedData?.label) {
                  return { ...el, spend: el.spend + (oldData?.sum || 0) };
                }
                return el;
              })
            : selectedMonth.labelsData?.map((el) =>
                el.name === editedData?.label
                  ? {
                      ...el,
                      spend:
                        el.spend + +(editedData.sum || 0) - (oldData?.sum || 0),
                    }
                  : el
              ),

        spendingData: selectedMonth.spendingData.map((el) =>
          el.id === id
            ? {
                ...el,
                spendingSum:
                  el.spendingSum +
                  (+(editedData?.sum || 0) - (oldData?.sum || 0)),
                spendingHistory: el.spendingHistory.map((_el) =>
                  _el.id === editedData?.id
                    ? {
                        ..._el,
                        comment: editedData.comment,
                        label: editedData.label,
                        sum: +editedData.sum,
                      }
                    : _el
                ),
              }
            : el
        ),
      };
      setData({ data, query: DatabaseQueryEnum.FINANCES, teamId: true });
      setEditedData(null);
    }
  };

  useEffect(() => {
    if (id) {
      const spendingData =
        selectedMonth?.spendingData.find((el) => el.id === id) || null;
      if (spendingData?.id) {
        setSpendingData(spendingData);
      } else {
        navigate("/finances/" + TabEnum.COSTS);
      }
    }
  }, [selectedMonth, id]);

  const reversed = [...(spendingData?.spendingHistory || [])].reverse();

  return (
    <div className={styles.payments}>
      <h2>Payments {formatValue(spendingData?.spendingSum, "₴")}</h2>
      <div className={styles.table}>
        <Table
          state={
            spendingData?.spendingHistory?.length
              ? LoadingState.LOADED
              : LoadingState.NO_DATA
          }
        >
          <div className={styles.item}>
            <div>Name</div>
            <div></div>
            <div>Label</div>
            <div>Comment</div>
            <div>Sum</div>
            <div>Date</div>
          </div>
          {reversed?.map((el) => {
            const user = teamData.users.find((user) => user.uid === el.userId);
            return (
              <div
                className={styles.item}
                key={el.id}
                onClick={() =>
                  setEditedData({
                    comment: el.comment || "",
                    label: el.label || "",
                    sum: String(el.sum),
                    id: el.id,
                  })
                }
              >
                <img src={user?.photoURL} alt="" />
                <div>{user?.displayName} </div>
                <div>{el?.label}</div>
                <div className={styles.comment}>{el.comment || "---"}</div>
                <div>{formatValue(el.sum, "₴")}</div>
                <div>{el.date}</div>
              </div>
            );
          })}
        </Table>
      </div>
      <ModalWrapper modalOpen={!!editedData?.id} height={255}>
        <div className={styles.modal}>
          <h3 className={styles.title}>Edit payment</h3>
          <FormWrapper>
            <input
              type="text"
              value={editedData?.comment}
              onChange={(e) =>
                editedData &&
                setEditedData({ ...editedData, comment: e.target.value })
              }
            />
            <select
              name="label"
              placeholder="Select label"
              value={editedData?.label}
              onChange={(e) =>
                editedData &&
                setEditedData({ ...editedData, label: e.target.value })
              }
            >
              {selectedMonth?.labelsData
                ?.filter((el) => el.userId === userData.uid || !el.userId)
                .map((el, i) => (
                  <option value={el.name} key={el.name + i}>
                    {el.name}
                  </option>
                ))}
            </select>

            <input
              type="number"
              value={editedData?.sum}
              onChange={(e) =>
                editedData &&
                setEditedData({ ...editedData, sum: e.target.value })
              }
            />

            <div className={styles.buttons}>
              <Button
                onClick={() => handleEditComment()}
                text="Save"
                nativeType="submit"
                disabled={!editedData?.sum}
                type="primary"
              />
              <Button
                onClick={() => setEditedData(null)}
                text="Cancel"
                type="secondary"
              />
            </div>
          </FormWrapper>
        </div>
      </ModalWrapper>
    </div>
  );
};
export default Payments;
