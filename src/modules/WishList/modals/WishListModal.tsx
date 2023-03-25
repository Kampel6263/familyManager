import Button from "../../../components/Button/Button";
import styles from "./WishListModal.module.scss";
import Modal from "react-modal";
import {
  DatabaseQueryEnum,
  PriorityEnum,
  setDataType,
  WishListType,
} from "../../../models";
import ModalWrapper from "../../../components/ModalWrapper/ModalWrapper";

type Props = {
  modalOpen: boolean;
  formData: WishListType;
  initialFormData: WishListType;
  teamId: string;
  setFormData: (data: WishListType) => void;
  setData: (data: setDataType) => void;
  closeModal: () => void;
};

const WishListModal: React.FC<Props> = ({
  modalOpen,
  formData,
  initialFormData,
  teamId,
  setData,
  setFormData,
  closeModal,
}) => {
  const prioritySelectData = [
    {
      label: "Very low",
      value: PriorityEnum.VERY_LOW,
    },
    {
      label: "Low",
      value: PriorityEnum.LOW,
    },
    {
      label: "Medium",
      value: PriorityEnum.MEDIUM,
    },
    {
      label: "Critical",
      value: PriorityEnum.CRITICAL,
    },
  ];

  const handleCloseModal = () => {
    closeModal();
    setFormData(initialFormData);
  };
  const handleSave = () => {
    setData({
      query: DatabaseQueryEnum.WISH_LIST,
      data: { ...formData, sum: +formData.sum },
      teamId,
    });
    handleCloseModal();
  };

  const onChangeForm = ({ key, value }: { key: string; value: any }) => {
    setFormData({ ...formData, [key]: value });
  };
  return (
    <ModalWrapper modalOpen={modalOpen}>
      <div className={styles.modal}>
        <h3>Add a new wish</h3>
        <div className={styles.form}>
          <input
            placeholder="Input name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              onChangeForm({ key: "name", value: e.target.value })
            }
          />
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
                Select type
              </option>
              <option value="home">Home</option>
              <option value="general">General</option>
              <option value="personal">Personal</option>
            </select>
            <select
              name="select"
              value={formData.priority}
              onChange={(e) =>
                onChangeForm({ key: "priority", value: +e.target.value })
              }
            >
              <option value="" disabled selected>
                Select priority
              </option>
              {prioritySelectData.map((el) => (
                <option key={el.value} value={el.value}>
                  {el.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Input sum"
              value={formData.sum}
              onChange={(e) =>
                onChangeForm({ key: "sum", value: e.target.value })
              }
            />
          </div>
          <div className={styles.buttons}>
            <Button
              text="Save"
              onClick={handleSave}
              disabled={Number.isNaN(+formData.sum) || !formData.sum}
            />
            <Button text="Cancel" onClick={handleCloseModal} type="secondary" />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default WishListModal;
