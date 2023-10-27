import dayjs from "dayjs";

import { setDataType } from "../../../../models";
import { CostsDataType } from "../../models/costs";
import styles from "./FinancicalMonths.module.scss";
import classNames from "classnames";
import CreateFinancicalMonthsModal from "../../modals/CreateFinancicalMonthsModal";
import { useState } from "react";

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

  return (
    <div className={styles.financicalMonths}>
      <h2>Financical months</h2>
      <div className={styles.cards}>
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
              setSelectedMonth(el);
            }}
            className={classNames(
              styles.card,
              el.selected && styles.selected,
              el.id === selectedMonth?.id && styles.currentSelected,
              el.closed && styles.closedCard
            )}
          >
            <div>{dayjs(el.month).format("MMMM, YYYY")}</div>
            {el.selected && <div className={styles.info}>&#x2714;</div>}
            {el.closed && (
              <div className={classNames(styles.info, styles.closed)}>
                Closed
              </div>
            )}
          </div>
        ))}
      </div>
      <CreateFinancicalMonthsModal
        setData={setData}
        spendingData={costsData[0]?.spendingData || null}
        labelsData={costsData[0]?.labelsData}
        modalOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
      />
    </div>
  );
};

export default FinancicalMonths;
