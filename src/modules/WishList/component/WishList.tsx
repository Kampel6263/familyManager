import classNames from "classnames";
import { useEffect, useState } from "react";
import PriorityTag from "../../../components/PriorityTag/PriorityTag";
import Table from "../../../components/Table/Table";
import {
  DatabaseQueryEnum,
  LoadingState,
  PriorityEnum,
  setDataType,
  TypeFilter,
  WishListType,
} from "../../../models";
import styles from "./WishList.module.scss";

import { formatValue } from "../../../helpers";
import Button from "../../../components/Button/Button";
import WishListModal from "../modals/WishListModal";

type Props = {
  teamId: string;
  data: WishListType[];
  userId: string;
  setData: (data: setDataType) => void;
};

const WishList: React.FC<Props> = ({ data, teamId, userId, setData }) => {
  const complatedWish = data.filter((el) =>
    el.type === "personal" ? el.done && el.userId === userId : el.done
  );
  const openedWish = data.filter((el) =>
    el.type === "personal" ? !el.done && el.userId === userId : !el.done
  );
  const sortData = (data: WishListType[]) =>
    data.sort((a, b) => (a.priority > b.priority ? -1 : 1));

  const [filteredOpenedData, setFilteredOpenedData] = useState<WishListType[]>(
    []
  );
  const [filteredComplateData, setFilteredComplateData] = useState<
    WishListType[]
  >([]);
  const [filter, setFilter] = useState<TypeFilter | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const initialFormData: WishListType = {
    name: "",
    priority: PriorityEnum.MEDIUM,
    sum: 0,
    type: "general",
    done: false,
    id: "",
    userId: userId,
  };
  const [formData, setFormData] = useState<WishListType>(initialFormData);

  const filters: { label: string; value: TypeFilter | null }[] = [
    {
      label: "All",
      value: null,
    },
    {
      label: "General",
      value: "general",
    },
    {
      label: "Home",
      value: "home",
    },
    {
      label: "Personal",
      value: "personal",
    },
  ];

  useEffect(() => {
    if (filter) {
      setFilteredOpenedData(
        sortData(openedWish).filter((el) => el.type === filter)
      );
      setFilteredComplateData(
        sortData(complatedWish).filter((el) => el.type === filter)
      );
    } else {
      setFilteredOpenedData(sortData(openedWish));
      setFilteredComplateData(sortData(complatedWish));
    }
  }, [filter, data]);

  const totalSum = filteredOpenedData?.reduce((accum, cur) => {
    return accum + cur.sum;
  }, 0);
  const allData = [...filteredOpenedData, ...filteredComplateData];
  return (
    <>
      <div className={styles.header}>
        <h2>Wish list</h2>
        <div>
          Total: <b>{formatValue(totalSum, "₴")}</b>
        </div>
      </div>

      <div className={styles.header}>
        <div className={styles.tabs}>
          {filters.map((el) => (
            <div
              key={el.value}
              className={classNames(
                styles.tabItem,
                filter === el.value && styles.active
              )}
              onClick={() => setFilter(el.value)}
            >
              {el.label}
            </div>
          ))}
        </div>

        <Button text="Add new" onClick={() => setModalOpen(true)} />
      </div>

      <Table
        className={styles.table}
        state={!allData.length ? LoadingState.NO_DATA : LoadingState.LOADED}
        children={
          !!allData.length && (
            <>
              <div className={styles.item}>
                <div>Name</div>
                <div>Type</div>
                <div>Priority</div>
                <div>Sum(UAH)</div>
                <div>Actions</div>
              </div>
              {allData.map((el, i) => (
                <div
                  key={el.name + i}
                  className={classNames(styles.item, el.done && styles.done)}
                >
                  <div>{el.name}</div>
                  <div>{el.type}</div>
                  <PriorityTag priority={el.priority} />
                  <div>{formatValue(el.sum, "₴")}</div>
                  <div className={styles.action}>
                    <span
                      className={el.done ? styles.done : ""}
                      onClick={() => {
                        setFormData(el);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </span>
                    <span
                      className={el.done ? styles.done : ""}
                      onClick={() => {
                        setData({
                          query: DatabaseQueryEnum.WISH_LIST,
                          data: el.id,
                          teamId: true,
                        });
                      }}
                    >
                      Delete
                    </span>
                    <span
                      onClick={() => {
                        setData({
                          query: DatabaseQueryEnum.WISH_LIST,
                          data: { ...el, done: !el.done },
                          teamId: true,
                        });
                      }}
                    >
                      {el.done ? "⤽" : "✓"}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )
        }
      />
      <WishListModal
        modalOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        formData={formData}
        initialFormData={initialFormData}
        teamId={teamId}
        setData={setData}
        setFormData={setFormData}
      />
    </>
  );
};

export default WishList;
