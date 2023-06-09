import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import Table from "../../../../components/Table/Table";
import { formatValue, totalSum } from "../../../../helpers";
import {
  DatabaseQueryEnum,
  LoadingState,
  TeamDataType,
  UserDataType,
  setDataType,
} from "../../../../models";
import { CostsDataType, SpendingDataType } from "../../models/costs";
import styles from "./Plan.module.scss";
import { TabEnum } from "../../models/main";
import AddCategoryModal from "../../modals/AddCategoryModal";
import { useMemo, useState } from "react";
import classNames from "classnames";
import PieChartWrapper from "../../../../components/PieChart/PieChartWrapper";

type Props = {
  teamData: TeamDataType;
  userData: UserDataType;
  isAdmin: boolean;
  selectedUsers: string[];
  selectedMonth: CostsDataType | null;
  setData: (data: setDataType) => void;
};

const Plan: React.FC<Props> = ({
  selectedMonth,
  selectedUsers,
  teamData,
  isAdmin,
  userData,
  setData,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryData, setCategoryData] = useState<SpendingDataType | null>(
    null
  );

  const filteredSpendingData =
    useMemo(
      () =>
        selectedUsers.length
          ? selectedMonth?.spendingData.filter((el) => {
              for (let id of selectedUsers) {
                if (el.userIds?.includes(id) || !el.userIds) {
                  return true;
                }
              }
              return false;
            })
          : selectedMonth?.spendingData.filter(
              (el) =>
                el.userIds?.includes(userData.uid) || !el.userIds || isAdmin
            ),
      [selectedMonth?.spendingData, userData, isAdmin, selectedUsers]
    ) || [];

  const navigate = useNavigate();
  if (!selectedMonth?.id) {
    return <div>Select month!</div>;
  }

  const handleCloseMonth = () => {
    setData({
      data: { ...selectedMonth, closed: true, selected: false },
      query: DatabaseQueryEnum.FINANCES,
      teamId: true,
    });
    navigate(`/finances/${TabEnum.FINANCIAL_MONTHS}`);
  };

  const handleDeleteCategory = (id: string) => {
    const data: CostsDataType = {
      ...selectedMonth,
      spendingData: selectedMonth.spendingData.filter((el) => el.id !== id),
    };
    setData({ data, query: DatabaseQueryEnum.FINANCES, teamId: true });
  };

  const usedValue = totalSum({
    key: "allocatedSum",
    data: filteredSpendingData || [],
  });
  const unUsedValue =
    (isAdmin
      ? selectedMonth.allocatedFunds
      : totalSum({
          data: filteredSpendingData || [],
          key: "allocatedSum",
        })) - usedValue;

  const spendingValue = totalSum({
    key: "spendingSum",
    data: filteredSpendingData || [],
  });
  return (
    <div className={styles.summary}>
      <div className={styles.header}>
        <h3>
          Plan -{" "}
          {isAdmin
            ? formatValue(selectedMonth.allocatedFunds, "₴")
            : formatValue(
                totalSum({
                  data: filteredSpendingData || [],
                  key: "allocatedSum",
                }),
                "₴"
              )}
        </h3>
        <div>
          <Button
            text="Add category"
            disabled={!isAdmin || selectedMonth.closed}
            onClick={() => setModalOpen(true)}
            type="primary"
          />
          &nbsp;&nbsp;
          <Button
            text="Close month"
            disabled={!isAdmin || selectedMonth.closed}
            onClick={() => handleCloseMonth()}
            type="secondary"
          />
        </div>
      </div>

      <div className={classNames(styles.content, "scrollbar")}>
        <div className={styles.pieChart}>
          <PieChartWrapper
            title="Allocated"
            sum={usedValue}
            data={[
              ...filteredSpendingData.map((el, i) => ({
                name: el.categoryName,
                value: el.allocatedSum,
                fill: el.categoryColor,
              })),
              {
                name: "Unused",
                value: unUsedValue,
                fill: "#aaa",
              },
            ]}
          />
          <PieChartWrapper
            title="Spending"
            sum={spendingValue}
            data={[
              ...filteredSpendingData.map((el, i) => ({
                name: el.categoryName,
                value: el.spendingSum,
                fill: el.categoryColor,
              })),
              {
                name: "Unused",
                value: usedValue - spendingValue,
                fill: "#aaa",
              },
            ]}
          />
        </div>

        <div>
          <Table state={LoadingState.LOADED} className={styles.table}>
            {!!selectedMonth.spendingData.length && (
              <div className={styles.item}>
                <div>Category</div>
                <div>Spending, ₴</div>
                <div>Spending, %</div>
              </div>
            )}
            {filteredSpendingData?.map((el) => (
              <div
                className={classNames(
                  styles.item,
                  (!isAdmin || selectedMonth.closed) && styles.disabled
                )}
                style={{
                  borderBottom: "2px solid" + el.categoryColor,
                }}
                onClick={() => {
                  setCategoryData(el);
                  setModalOpen(true);
                }}
              >
                <div>
                  <div
                    className={styles.color}
                    style={{ background: el.categoryColor }}
                  ></div>{" "}
                  {el.categoryName}
                </div>
                <div>
                  {formatValue(el.spendingSum)}/
                  {formatValue(el.allocatedSum, "", "₴")}
                </div>
                <div>
                  {formatValue(
                    (el.spendingSum / el.allocatedSum) * 100 || 0,
                    "",
                    "%"
                  )}
                </div>
                <Button
                  text=""
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(el.id);
                  }}
                  type="remove"
                />
              </div>
            ))}
            <div className={styles.item}>
              <div>
                <div
                  className={styles.color}
                  style={{ background: "#aaa" }}
                ></div>{" "}
                Unused
              </div>
              <div>{formatValue(unUsedValue, "", "₴")}</div>
              <div>
                {formatValue(
                  (unUsedValue / selectedMonth.allocatedFunds) * 100,
                  "",
                  "%"
                )}
              </div>
            </div>
          </Table>
        </div>
      </div>
      <AddCategoryModal
        teamData={teamData}
        categoryData={categoryData}
        closeModal={() => {
          setModalOpen(false);
          setCategoryData(null);
        }}
        modalOpen={modalOpen}
        monthData={selectedMonth}
        setData={setData}
      />
    </div>
  );
};

export default Plan;
