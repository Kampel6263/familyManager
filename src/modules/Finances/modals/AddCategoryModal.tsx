import { useEffect, useMemo, useState } from "react";
import ModalWrapper from "../../../components/ModalWrapper/ModalWrapper";
import dayjs from "dayjs";
import styles from "./Modal.module.scss";
import Button from "../../../components/Button/Button";
import useDataManage from "../../../hooks/useDataManage";
import { DatabaseQueryEnum, TeamDataType, setDataType } from "../../../models";
import { CostsDataType, SpendingDataType } from "../models/costs";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";
type Props = {
  modalOpen: boolean;
  monthData: CostsDataType;
  teamData: TeamDataType;
  categoryData: SpendingDataType | null;
  setData: (data: setDataType) => void;
  closeModal: () => void;
};

type InitialValues = {
  allocatedSum: number | undefined;
  categoryName: string;
  categoryColor: string;
  forAllUsers: boolean;
  userIds: { value: string; label: string }[];
};
const colors = [
  "#E14F62",
  "#82D4F7",
  "#F2C94C",
  "#94CA42",
  "#55B5A6",
  "#4E80EE",
  "#845EEE",
  "#C951E7",
  "#DA5597",
  "#9ba4aa",
];
const AddCategoryModal: React.FC<Props> = ({
  modalOpen,
  categoryData,
  closeModal,
  monthData,
  teamData,
  setData,
}) => {
  const animatedComponents = makeAnimated();
  console.log(categoryData, "categoryData");
  const options: { value: string; label: string }[] = teamData.users
    .filter((el) => el.verified)
    .map((el) => ({ label: el.displayName || el.email, value: el.uid }));
  const initialValues: InitialValues = useMemo(
    () =>
      categoryData
        ? {
            allocatedSum: categoryData.allocatedSum,
            categoryName: categoryData.categoryName,
            forAllUsers:
              (categoryData?.userIds?.length || options.length) >=
              options.length,
            categoryColor: categoryData.categoryColor,
            userIds:
              categoryData.userIds?.map((el) => ({
                label: teamData.users.find((user) => user.uid === el)!
                  .displayName,
                value: el,
              })) || options,
          }
        : {
            allocatedSum: undefined,
            categoryName: "",
            forAllUsers: true,
            categoryColor: colors[0],
            userIds: [],
          },
    [categoryData]
  );

  const [formData, setFormData] = useState<InitialValues>(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleClose = () => {
    setFormData({
      allocatedSum: undefined,
      categoryName: "",
      forAllUsers: true,
      userIds: [],
      categoryColor: colors[0],
    });
    closeModal();
  };

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleCreate = () => {
    if (formData) {
      const usersIds = formData.userIds.map(
        (el: { value: string; label: string }) => el.value
      );
      const data: CostsDataType = {
        ...monthData,
        spendingData: categoryData
          ? monthData.spendingData.map((el) => {
              if (el.id === categoryData.id) {
                return {
                  allocatedSum: +(formData.allocatedSum || 0),
                  categoryName: formData.categoryName,
                  spendingHistory: categoryData.spendingHistory,
                  spendingSum: categoryData.spendingSum,
                  id: uuidv4(),
                  userIds: formData.forAllUsers ? null : usersIds,
                  categoryColor: formData.categoryColor,
                };
              }
              return el;
            })
          : [
              ...monthData.spendingData,
              {
                allocatedSum: +(formData.allocatedSum || 0),
                categoryName: formData.categoryName,
                spendingHistory: [],
                spendingSum: 0,
                id: uuidv4(),
                userIds: formData.forAllUsers ? null : usersIds,
                categoryColor: formData.categoryColor,
              },
            ],
      };
      setData({ data, query: DatabaseQueryEnum.FINANCES, teamId: true });
      handleClose();
    }
  };

  return (
    <ModalWrapper modalOpen={modalOpen} height={352} width={520}>
      <div className={styles.modal}>
        <h3 className={styles.title}>
          {categoryData ? "Edit category" : "Add category"}{" "}
        </h3>
        <input
          type="text"
          placeholder="Name"
          value={formData?.categoryName}
          onChange={(e) => handleChange("categoryName", e.target.value)}
        />
        <div className={styles.colors}>
          {colors.map((color) => {
            return (
              <div
                className={classNames(
                  styles.color,
                  formData.categoryColor.toLowerCase() ===
                    color.toLowerCase() && styles.active
                )}
                style={{ background: color, borderColor: color }}
                onClick={() => handleChange("categoryColor", color)}
              >
                <div
                  className={styles.border}
                  style={{ border: `1px solid ${color}` }}
                ></div>
              </div>
            );
          })}

          <div className={styles.color}>
            <label
              htmlFor="custom"
              className={classNames(styles.color, styles.custom)}
            >
              Custom
            </label>
            <input
              id="custom"
              type="color"
              value={formData.categoryColor}
              onChange={(e) => handleChange("categoryColor", e.target.value)}
            />
          </div>
        </div>
        <input
          type="number"
          placeholder="Allocated sum"
          value={formData.allocatedSum}
          onChange={(e) => handleChange("allocatedSum", e.target.value)}
        />
        <div className={styles.checkbox}>
          <input
            id="checkbox"
            type="checkbox"
            checked={formData.forAllUsers}
            onChange={() => handleChange("forAllUsers", !formData.forAllUsers)}
          />
          <label htmlFor="checkbox">All users</label>
        </div>

        <Select
          isMulti
          onChange={(e) => handleChange("userIds", e)}
          closeMenuOnSelect={false}
          components={animatedComponents}
          placeholder={"Select users"}
          options={options}
          captureMenuScroll
          className={styles.select}
          isDisabled={formData.forAllUsers}
          menuPlacement="top"
          value={formData.userIds}
        />
        <div className={styles.buttons}>
          <Button
            text={categoryData ? "Save" : "Create"}
            disabled={
              !formData.allocatedSum ||
              !formData.categoryName ||
              (!formData.forAllUsers && formData.userIds.length === 0)
            }
            onClick={() => handleCreate()}
          />
          <Button
            text={"Cancel"}
            onClick={() => handleClose()}
            type="secondary"
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddCategoryModal;
