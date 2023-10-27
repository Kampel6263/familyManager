import React, { useState } from "react";
import Button from "../../../components/Button/Button";
import Table from "../../../components/Table/Table";
import { services } from "../../../constants";
import { formatValue, totalSum } from "../../../helpers";
import {
  DatabaseQueryEnum,
  LoadingState,
  setDataType,
  SibscribersDataType,
} from "../../../models";
import SibscribersModal from "../modals/SibscribersModal";
import styles from "./Sibscribers.module.scss";
import noservicename from "../../../assets/services/noservicename.png";

type Props = {
  data: SibscribersDataType[];
  teamId: string;

  setData: (data: setDataType) => void;
};

const Sibscribers: React.FC<Props> = ({
  data,
  teamId,

  setData,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<SibscribersDataType | undefined>();

  const getDaysLeft = (date: number) => {
    const today = new Date().getDate();

    if (date > today) {
      return date - today;
    } else if (date < today) {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const daysInMonth = new Date(year, month, 0).getDate();
      return daysInMonth - today + date;
    }
    return 0;
  };

  return (
    <>
      <div className={styles.header}>
        <h2>
          Sibscribers {formatValue(totalSum({ data: data, key: "cost" }), "₴")}
        </h2>
        <Button text="Add new" onClick={() => setModalOpen(true)} />
      </div>

      <Table
        className={styles.table}
        children={
          <>
            <div className={styles.item}>
              <div>Service</div>
              <div>Date</div>
              <div>Days left</div>
              <div>Cost(UAH)</div>
              <div>Actions</div>
            </div>
            {data
              .sort((a, b) => {
                const daysLeftA = getDaysLeft(a.monthNumber);
                const daysLeftB = getDaysLeft(b.monthNumber);
                if (daysLeftA > daysLeftB) {
                  return 1;
                } else if (daysLeftA < daysLeftB) {
                  return -1;
                }
                return 0;
              })
              .map((el, i) => {
                const serviceData = services.find(
                  (service) => service.value === el.type
                );
                return (
                  <div key={el.service + i} className={styles.item}>
                    <div className={styles.service}>
                      <img
                        className={styles.serviceImg}
                        src={serviceData?.img || noservicename}
                        alt=""
                      />
                      <span>
                        {serviceData?.label} {el.service && ` - ${el.service}`}
                      </span>
                    </div>
                    <div>{el.monthNumber}</div>
                    <div>{getDaysLeft(el.monthNumber)}</div>
                    <div>{formatValue(el.cost, "₴")}</div>
                    <div className={styles.action}>
                      <span
                        onClick={() => {
                          setEditItem(el);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </span>
                      <span
                        onClick={() => {
                          setData({
                            query: DatabaseQueryEnum.SIBSCRIBERS,
                            data: el.id,
                            teamId: true,
                          });
                        }}
                      >
                        Delete
                      </span>
                    </div>
                  </div>
                );
              })}
          </>
        }
        state={data.length ? LoadingState.LOADED : LoadingState.NO_DATA}
      />
      <SibscribersModal
        modalOpen={modalOpen}
        teamId={teamId}
        setData={setData}
        clearData={() => setEditItem(undefined)}
        modalData={editItem}
        closeModal={() => setModalOpen(false)}
      />
    </>
  );
};

export default Sibscribers;
