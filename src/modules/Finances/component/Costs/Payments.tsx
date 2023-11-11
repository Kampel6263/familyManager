import { useNavigate, useParams } from "react-router-dom";
import styles from "./Costs.module.scss";
import { CostsDataType, SpendingDataType } from "../../models/costs";
import { useEffect, useState } from "react";
import Table from "../../../../components/Table/Table";
import {
  DatabaseQueryEnum,
  LoadingState,
  TeamDataType,
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
  setData: (data: setDataType) => void;
};

const Payments: React.FC<Props> = ({ selectedMonth, teamData, setData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spendingData, setSpendingData] = useState<SpendingDataType | null>(
    null
  );

  const [editedData, setEditedData] = useState<{
    comment: string;
    id: string;
  } | null>(null);

  const handleEditComment = (newComment: string, itemId: string) => {
    if (selectedMonth) {
      const data: CostsDataType = {
        ...selectedMonth,
        spendingData: selectedMonth.spendingData.map((el) =>
          el.id === id
            ? {
                ...el,
                spendingHistory: el.spendingHistory.map((_el) =>
                  _el.id === itemId ? { ..._el, comment: newComment } : _el
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
              <div className={styles.item} key={el.id}>
                <img src={user?.photoURL} alt="" />
                <div>{user?.displayName} </div>
                <div>{el?.label}</div>
                <div
                  className={styles.comment}
                  onClick={() =>
                    setEditedData({ comment: el.comment || "", id: el.id })
                  }
                >
                  {el.comment || "---"}
                </div>
                <div>{formatValue(el.sum, "₴")}</div>
                <div>{el.date}</div>
              </div>
            );
          })}
        </Table>
      </div>
      <ModalWrapper modalOpen={!!editedData?.id} height={165}>
        <div className={styles.modal}>
          <h3 className={styles.title}>Edit comment</h3>
          <FormWrapper>
            <input
              type="text"
              value={editedData?.comment}
              onChange={(e) =>
                editedData &&
                setEditedData({ ...editedData, comment: e.target.value })
              }
            />
            <div className={styles.buttons}>
              <Button
                onClick={() =>
                  handleEditComment(editedData?.comment || "", editedData!.id)
                }
                text="Save"
                nativeType="submit"
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
