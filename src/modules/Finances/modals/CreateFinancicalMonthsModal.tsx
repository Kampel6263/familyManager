import { useState } from "react";
import ModalWrapper from "../../../components/ModalWrapper/ModalWrapper";
import dayjs from "dayjs";
import styles from "./Modal.module.scss";
import Button from "../../../components/Button/Button";
import { DatabaseQueryEnum, setDataType } from "../../../models";
import { CostsDataType, SpendingDataType } from "../models/costs";
import classNames from "classnames";

type Props = {
  modalOpen: boolean;
  spendingData: SpendingDataType[];
  setData: (data: setDataType) => void;
  closeModal: () => void;
};

const CreateFinancicalMonthsModal: React.FC<Props> = ({
  modalOpen,
  spendingData,
  closeModal,
  setData,
}) => {
  const [month, setMonth] = useState(dayjs(new Date()).format("YYYY-MM"));
  const [funds, setFunds] = useState<number | null>(null);
  const [saveCategories, setSaveCategories] = useState(!!spendingData);
  const handleClose = () => {
    setMonth(dayjs(new Date()).format("YYYY-MM"));
    closeModal();
  };
  const handleCreate = () => {
    const spendingDataForRequest = saveCategories
      ? spendingData?.map((el) => ({
          ...el,
          spendingHistory: [],
          spendingSum: 0,
        }))
      : [];

    const data: CostsDataType = {
      allocatedFunds: funds || 0,
      spendingData: spendingDataForRequest,
      closed: false,
      month,
      id: "",
      selected: false,
      lastCostUpdate: "",
    };
    setData({ data: data, query: DatabaseQueryEnum.FINANCES, teamId: true });
    handleClose();
  };
  return (
    <ModalWrapper modalOpen={modalOpen} height={261}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Create month</h3>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <input
          type="number"
          placeholder="Funds for month"
          value={funds || undefined}
          onChange={(e) => setFunds(+e.target.value)}
        />
        <div
          className={classNames(
            styles.checkbox,
            !spendingData && styles.disabled
          )}
        >
          <input
            id="checkbox"
            type="checkbox"
            checked={saveCategories}
            onChange={() => setSaveCategories(!saveCategories)}
          />
          <label htmlFor="checkbox">Save categories from last month</label>
        </div>

        <div className={styles.buttons}>
          <Button
            text="Create"
            onClick={() => {
              handleCreate();
            }}
            disabled={!funds}
            type="primary"
          />
          <Button text="Cancel" onClick={() => handleClose()} />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CreateFinancicalMonthsModal;
