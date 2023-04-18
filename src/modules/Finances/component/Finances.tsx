import React, { useEffect, useMemo, useState } from "react";
import styles from "./Finances.module.scss";

import { CostsDataType } from "../models/costs";

import {
  DatabaseQueryEnum,
  TeamDataType,
  UserDataType,
  setDataType,
} from "../../../models";

import Button from "../../../components/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import Plan from "./Plan/Plan";
import Costs from "./Costs/Costs";
import { TabEnum } from "../models/main";
import FinancicalMonths from "./FinancicalMonths/FinancicalMonths";
import dayjs from "dayjs";
import showIcon from "../../../assets/globalImgs/showIcon.svg";
import select from "../../../assets/globalImgs/select.svg";

type Props = {
  costsData: CostsDataType[];
  teamData: TeamDataType;
  userData: UserDataType;
  setData: (data: setDataType) => void;
};

const Finances: React.FC<Props> = ({
  costsData,
  teamData,
  userData,
  setData,
}) => {
  const { tab } = useParams();
  const [usersFilter, setUsersFilter] = useState<string[]>([]);
  const navigate = useNavigate();
  const isAdmin = useMemo(
    () => userData.uid === teamData.teamId,
    [teamData, userData]
  );
  const sortByDate = (a: string, b: string) => {
    const now = dayjs(new Date());
    const dif1 = dayjs(now).diff(a, "days");
    const dif2 = dayjs(now).diff(b, "days");

    if (dif1 > dif2) {
      return 1;
    } else if (dif1 < dif2) {
      return -1;
    }
    return 0;
  };
  const handleSelect = (data: CostsDataType) => {
    const currentSelected: CostsDataType | null =
      costsData?.find((el) => el.selected) || null;
    if (currentSelected?.id) {
      setData({
        data: { ...currentSelected, selected: false },
        query: DatabaseQueryEnum.FINANCES,
        teamId: true,
      });
    }

    setData({
      data: { ...data, selected: true },
      query: DatabaseQueryEnum.FINANCES,
      teamId: true,
    });
  };

  const sortedCostsData = useMemo(
    () => costsData.sort((a, b) => sortByDate(a.month, b.month)),
    [costsData]
  );

  const [selectedMonth, setSelectedMonth] = useState<CostsDataType | null>(
    null
  );

  const handleReopen = () => {
    if (selectedMonth?.id) {
      const data: CostsDataType = {
        ...selectedMonth,
        closed: false,
      };
      setData({ data, query: DatabaseQueryEnum.FINANCES, teamId: true });
    }
  };
  useEffect(() => {
    const selectedMonth = costsData.find((el) => el.selected) || null;
    setSelectedMonth(selectedMonth);
    if (!selectedMonth) {
      navigate("/finances/" + TabEnum.FINANCIAL_MONTHS);
    }
  }, [costsData]);

  const tabs: {
    label: string;
    path: string;
    private?: boolean;
    disabled?: boolean;
  }[] = [
    {
      label: "Plan",
      path: TabEnum.PLAN,
      disabled: !selectedMonth,
    },
    {
      label: "Costs",
      path: TabEnum.COSTS,
      disabled: !selectedMonth || selectedMonth.closed,
    },
    {
      label: "Financial months",
      path: TabEnum.FINANCIAL_MONTHS,
    },
  ];

  return (
    <>
      <div className={styles.header}>
        <div className={styles.tabs}>
          {tabs.map((tabItem) => (
            <div
              onClick={() => navigate("/finances/" + tabItem.path)}
              className={classNames(
                styles.tab,
                tabItem.path === tab && styles.active,
                tabItem.disabled && styles.disabled
              )}
            >
              {tabItem.label}
            </div>
          ))}
        </div>

        <div className={styles.users}>
          {tab === TabEnum.PLAN &&
            isAdmin &&
            teamData.users
              .filter((el) => el.verified)
              .map((el) => {
                const active = usersFilter.includes(el.uid);
                return (
                  <img
                    className={active ? styles.active : ""}
                    src={el.photoURL}
                    onClick={() =>
                      active
                        ? setUsersFilter(
                            usersFilter.filter((id) => id !== el.uid)
                          )
                        : setUsersFilter([...usersFilter, el.uid])
                    }
                    alt=""
                  />
                );
              })}
        </div>

        {selectedMonth && (
          <div className={styles.buttons}>
            {!selectedMonth.selected && (
              <>
                <Button
                  text={selectedMonth.closed ? "Reopen" : "Select"}
                  disabled={!isAdmin}
                  onClick={() =>
                    selectedMonth.closed
                      ? handleReopen()
                      : handleSelect(selectedMonth)
                  }
                  type="primary"
                />
                &nbsp;&nbsp;
              </>
            )}
            <div
              className={classNames(
                styles.selectedMonth,
                selectedMonth.selected && styles.selected
              )}
            >
              <img src={selectedMonth.selected ? select : showIcon} alt="" />{" "}
              {dayjs(selectedMonth?.month).format("MMMM, YYYY")}
            </div>
          </div>
        )}
      </div>

      {tab === TabEnum.PLAN && (
        <Plan
          setData={setData}
          selectedUsers={usersFilter}
          selectedMonth={selectedMonth}
          teamData={teamData}
          userData={userData}
          isAdmin={isAdmin}
        />
      )}
      {tab === TabEnum.COSTS && (
        <Costs
          selectedMonth={selectedMonth}
          teamData={teamData}
          setData={setData}
          userData={userData}
        />
      )}
      {tab === TabEnum.FINANCIAL_MONTHS && (
        <FinancicalMonths
          isAdmin={isAdmin}
          costsData={sortedCostsData}
          selectedMonth={selectedMonth}
          setData={setData}
          setSelectedMonth={setSelectedMonth}
        />
      )}
    </>
  );
};

export default Finances;
