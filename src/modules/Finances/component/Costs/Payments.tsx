import { useNavigate, useParams } from "react-router-dom";
import styles from "./Costs.module.scss";
import { CostsDataType, SpendingDataType } from "../../models/costs";
import { useEffect, useState } from "react";
import Table from "../../../../components/Table/Table";
import { LoadingState, TeamDataType } from "../../../../models";

import { formatValue } from "../../../../helpers";
import { TabEnum } from "../../models/main";

type Props = {
  selectedMonth: CostsDataType | null;
  teamData: TeamDataType;
};

const Payments: React.FC<Props> = ({ selectedMonth, teamData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spendingData, setSpendingData] = useState<SpendingDataType | null>(
    null
  );
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

                <div>{el.comment || "---"}</div>
                <div>{formatValue(el.sum, "₴")}</div>
                <div>{el.date}</div>
              </div>
            );
          })}
        </Table>
      </div>
    </div>
  );
};
export default Payments;
