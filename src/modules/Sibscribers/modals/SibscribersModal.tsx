import React, { useEffect, useState } from "react";
import styles from "./SibscribersModal.module.scss";
import Modal from "react-modal";
import Button from "../../../components/Button/Button";
import {
  DatabaseQueryEnum,
  setDataType,
  SibscribersDataType,
} from "../../../models";
import { services } from "../../../constants";
import ModalWrapper from "../../../components/ModalWrapper/ModalWrapper";

type Props = {
  modalOpen: boolean;
  modalData?: SibscribersDataType;
  teamId: string;
  clearData: () => void;
  closeModal: () => void;
  setData: (data: setDataType) => void;
};

const initialModalData: SibscribersDataType = {
  cost: 0,
  type: "",
  monthNumber: 0,
  service: "",
  id: "",
};

const SibscribersModal: React.FC<Props> = ({
  modalOpen,
  modalData,
  teamId,
  clearData,
  closeModal,
  setData,
}) => {
  const [formData, setFormData] = useState(initialModalData);

  useEffect(() => {
    if (modalData) {
      setFormData(modalData);
    }
  }, [modalData]);

  const handleSave = () => {
    setData({
      query: DatabaseQueryEnum.SIBSCRIBERS,
      data: {
        ...formData,
        monthNumber: +formData.monthNumber,
        cost: +formData.cost,
      },
      teamId: true,
    });
    setFormData(initialModalData);
    handleClose();
  };

  const handleClose = () => {
    clearData();
    closeModal();
    setFormData(initialModalData);
  };

  const onChangeForm = ({ key, value }: { key: string; value: any }) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <ModalWrapper modalOpen={modalOpen} height={227}>
      <div className={styles.modal}>
        <h3>Add a new sibscribe</h3>
        <div className={styles.form}>
          <div className={styles.fields}>
            <select
              name="select"
              placeholder="Select type"
              value={formData.type}
              onChange={(e) =>
                onChangeForm({ key: "type", value: e.target.value })
              }
            >
              <option value="" disabled selected>
                Select service
              </option>
              {services.map((el, i) => (
                <option value={el.value} key={el.value + i}>
                  {el.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={formData.service}
              placeholder={"Comment"}
              onChange={(e) =>
                onChangeForm({ key: "service", value: e.target.value })
              }
            />
          </div>

          <div className={styles.fields}>
            <input
              type="text"
              placeholder="Input cost"
              value={formData.cost || ""}
              onChange={(e) =>
                onChangeForm({ key: "cost", value: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Input date"
              value={formData.monthNumber || ""}
              onChange={(e) =>
                onChangeForm({ key: "monthNumber", value: e.target.value })
              }
            />
          </div>
        </div>
        <div className={styles.buttons}>
          <Button
            text="Save"
            onClick={handleSave}
            disabled={
              Number.isNaN(+formData.cost) ||
              !formData.cost ||
              Number.isNaN(+formData.monthNumber) ||
              !formData.monthNumber ||
              !formData.type
            }
          />

          <Button onClick={handleClose} text="Cancel" />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default SibscribersModal;
