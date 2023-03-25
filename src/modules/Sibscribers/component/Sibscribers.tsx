import React, { useState } from "react";
import Button from "../../../components/Button/Button";
import Table from "../../../components/Table/Table";
import { services } from "../../../constants";
import { formatValue, totalSum } from "../../../helpers";
import {
  DatabaseQueryEnum,
  setDataType,
  SibscribersDataType,
} from "../../../models";
import SibscribersModal from "../modals/SibscribersModal";
import styles from "./Sibscribers.module.scss";

type Props = {
  data: SibscribersDataType[];
  teamId: string;
  setData: (data: setDataType) => void;
};

const Sibscribers: React.FC<Props> = ({ data, teamId, setData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<SibscribersDataType | undefined>();

  return (
    <div>
      <div className={styles.header}>
        <h2>
          Sibscribers {formatValue(totalSum({ data: data, key: "cost" }), "₴")}
        </h2>
        <Button text="Add new" onClick={() => setModalOpen(true)} />
      </div>

      <Table
        children={
          <>
            <div className={styles.item}>
              <div>Service</div>
              <div>Date</div>
              <div>Days left</div>
              <div>Cost(UAH)</div>
              <div>Actions</div>
            </div>
            {data.map((el, i) => {
              const serviceData = services.find(
                (service) => service.value === el.type
              );
              return (
                <div key={el.service + i} className={styles.item}>
                  <div className={styles.service}>
                    <img
                      className={styles.serviceImg}
                      src={serviceData?.img}
                      alt=""
                    />
                    <span>
                      {serviceData?.label} {el.service && ` - ${el.service}`}
                    </span>
                  </div>
                  <div>{el.monthNumber}</div>
                  <div>{31 - el.monthNumber}</div>
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
                          teamId,
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
        loading={!data || !data.length}
      />
      <SibscribersModal
        modalOpen={modalOpen}
        teamId={teamId}
        setData={setData}
        clearData={() => setEditItem(undefined)}
        modalData={editItem}
        closeModal={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Sibscribers;
