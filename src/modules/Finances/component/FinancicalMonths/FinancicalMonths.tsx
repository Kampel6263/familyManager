import dayjs from "dayjs";

import { setDataType } from "../../../../models";
import { CostsDataType } from "../../models/costs";
import styles from "./FinancicalMonths.module.scss";
import classNames from "classnames";
import { useState } from "react";
import { formatValue } from "../../../../helpers";
import CreateEditFinancicalMonthsModal from "../../modals/CreateEditFinancicalMonthsModal";

type Props = {
  costsData: CostsDataType[];
  selectedMonth: CostsDataType | null;
  isAdmin: boolean;
  setSelectedMonth: (data: CostsDataType | null) => void;
  setData: (data: setDataType) => void;
};

const FinancicalMonths: React.FC<Props> = ({
  costsData,
  selectedMonth,
  isAdmin,
  setSelectedMonth,
  setData,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const [editMonthData, setEditMonthData] = useState<CostsDataType | null>(
    null
  );

  return (
    <div className={styles.financicalMonths}>
      <h2>Financical months</h2>
      <div className={classNames(styles.cards, "scrollbar")}>
        <div
          className={classNames(
            styles.card,
            styles.add,
            !isAdmin && styles.disabled
          )}
          onClick={() => setModalOpen(true)}
        >
          + Create
        </div>
        {costsData.map((el) => (
          <div
            onClick={() => {
              if (selectedMonth?.id === el.id) {
                setEditMonthData(el);
                setModalOpen(true);
              } else {
                setSelectedMonth(el);
              }
            }}
            className={classNames(
              styles.card,
              el.selected && styles.selected,
              el.id === selectedMonth?.id && styles.currentSelected,
              el.closed && styles.closedCard
            )}
          >
            <div>{dayjs(el.month).format("MMMM, YYYY")}</div>
            <div className={styles.allocatedFunds}>
              {formatValue(el.allocatedFunds, undefined, "₴")}
            </div>
            {el.selected && <div className={styles.info}>&#x2714;</div>}
            {el.closed && (
              <div className={classNames(styles.info, styles.closed)}>
                Closed
              </div>
            )}
          </div>
        ))}
      </div>
      <CreateEditFinancicalMonthsModal
        setData={setData}
        spendingData={costsData[0]?.spendingData || null}
        labelsData={costsData[0]?.labelsData}
        modalOpen={modalOpen}
        editMonthData={editMonthData}
        closeModal={() => {
          setModalOpen(false);
          setEditMonthData(null);
        }}
      />
    </div>
  );
};

export default FinancicalMonths;
