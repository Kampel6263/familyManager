import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import {
  DatabaseQueryEnum,
  LoadingState,
  PetsDataType,
  setDataType,
} from "../../../models";
import styles from "./Pets.module.scss";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getDiffColor, getIconByPetType, getPetAge } from "../helpers/main";
import PetForm from "./PetForm/PetForm";
import PillsModadal from "./Modal/PillsModal";
import classNames from "classnames";
import Loader from "../../../components/Loader/Loader";
dayjs.extend(relativeTime);
type Props = {
  tab: string;
  data: PetsDataType[];
  setData: (data: setDataType) => void;
};

const CreateViewPet: React.FC<Props> = ({ tab, data, setData }) => {
  const [mode, setMode] = useState<"create" | "view" | "edit">();
  const [petData, setPetData] = useState<PetsDataType>();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (tab === "create") {
      setMode("create");
    } else {
      const pet = data.find((el) => el.id === tab);
      if (pet?.id) {
        setMode("view");
        setPetData(pet);
      } else {
        navigate("/pets");
      }
    }
  }, [tab, data]);

  const handleDeletePill = (i: number) => {
    if (petData) {
      const data: PetsDataType = {
        ...petData,
        pillsData: petData.pillsData.filter((el, index) => index !== i),
      };
      setData({ data, query: DatabaseQueryEnum.PETS, teamId: true });
    }
  };

  const sort = (date1: string, date2: string) => {
    return new Date(date2).getTime() - new Date(date1).getTime();
  };
  const lastDiff = dayjs(new Date()).diff(
    dayjs(petData?.lastVaccination),
    "days"
  );
  const lastDiffMonth = dayjs(new Date()).diff(
    dayjs(petData?.lastVaccination),
    "month"
  );

  const nextDiff = dayjs(petData?.nextVaccination).diff(
    dayjs(new Date()),
    "days"
  );

  return (
    <>
      {mode === "create" ? (
        <PetForm setData={setData} />
      ) : (
        <div className={styles.content}>
          {mode === "edit" ? (
            <PetForm
              setData={setData}
              initialValues={petData}
              closeEdit={() => setMode("view")}
            />
          ) : (
            <div className={styles.view}>
              <div className={styles.header}>
                <h2>{petData?.name}</h2>
                <div className={styles.headerButtons}>
                  <Button
                    text="Edit"
                    onClick={() => {
                      setMode("edit");
                    }}
                    type={"primary"}
                  />
                  <Button
                    text="Remove"
                    onClick={() =>
                      setData({
                        data: petData!.id,
                        query: DatabaseQueryEnum.PETS,
                        teamId: true,
                      })
                    }
                    type={"secondary"}
                  />
                </div>
              </div>

              <div className={styles.line}>
                <div>Type:</div>
                <div>
                  <img src={getIconByPetType(petData?.petType || "")} alt="" />
                </div>
              </div>
              <div className={styles.line}>
                <div>Breed:</div>
                <div> {petData?.breed}</div>
              </div>
              <div className={styles.line}>
                <div>Age:</div>
                <div>{getPetAge(petData?.birthday || "")}</div>
              </div>
              <div className={styles.line}>
                <div>Birthday:</div>
                <div>{dayjs(petData?.birthday).format("DD, MMMM, YYYY")}</div>
              </div>

              <div className={styles.line}>
                <div>Sex:</div> <div>{petData?.sex}</div>
              </div>
              <div className={styles.line}>
                <div>Last vaccination:</div>{" "}
                <div>
                  {dayjs(petData?.lastVaccination).format("DD, MMMM, YYYY")}{" "}
                  <b
                    className={styles.vaccinationDiff}
                    style={{ color: getDiffColor(lastDiff, "last", 0.5) }}
                  >
                    {lastDiffMonth
                      ? `${lastDiffMonth} month(s) ago`
                      : "This month"}
                  </b>
                </div>
              </div>
              <div className={styles.line}>
                <div>Next vaccination:</div>{" "}
                <div>
                  {dayjs(petData?.nextVaccination).format("DD, MMMM, YYYY")}{" "}
                  <b
                    className={styles.vaccinationDiff}
                    style={{
                      color: getDiffColor(nextDiff, "next", 0.5),
                    }}
                  >
                    {nextDiff} day(s) left
                  </b>
                </div>
              </div>
            </div>
          )}

          <div className={classNames(styles.pillsData, "scrollbar")}>
            <div className={styles.header}>
              <h2>Pills history</h2>
              <Button
                text="+"
                onClick={() => setModalOpen(true)}
                type="primary"
              />
            </div>
            <div className={styles.pills}>
              {petData?.pillsData
                .sort((a, b) => sort(a.date, b.date))
                .map((el, i) => (
                  <div className={styles.pillItem}>
                    <div className={styles.deleteButton}>
                      <Button
                        text=""
                        onClick={() => handleDeletePill(i)}
                        type="remove"
                      />
                    </div>
                    <div className={styles.dateData}>
                      <div className={styles.date}>
                        {dayjs(el.date).format("DD MMMM YYYY")}
                      </div>
                      <div className={styles.daysAgo}>
                        {dayjs(new Date()).diff(el.date, "days")} day(s) ago
                      </div>
                    </div>

                    <div className={styles.name}>{el.name || "-"}</div>
                    <div className={styles.checkboxes}>
                      <div
                        className={classNames(
                          styles.tag,
                          el.fleas && styles.active
                        )}
                      >
                        Fleas
                      </div>
                      <div
                        className={classNames(
                          styles.tag,
                          el.worms && styles.active
                        )}
                      >
                        Worms
                      </div>
                      <div
                        className={classNames(
                          styles.tag,
                          el.mites && styles.active
                        )}
                      >
                        Mites
                      </div>
                    </div>
                  </div>
                ))}
              {!petData?.pillsData.length && (
                <Loader state={LoadingState.NO_DATA} />
              )}
            </div>
          </div>
        </div>
      )}
      <PillsModadal
        modalOpen={modalOpen}
        petData={petData}
        setData={setData}
        setModalOpen={setModalOpen}
      />
    </>
  );
};

export default CreateViewPet;
