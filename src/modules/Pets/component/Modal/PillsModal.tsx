import ModalWrapper from "../../../../components/ModalWrapper/ModalWrapper";
import styles from "./PillsModal.module.scss";
import FleasIcon from "../../../../assets/Pills/fleas.png";
import Worms from "../../../../assets/Pills/worm-512.webp";
import Mites from "../../../../assets/Pills/mites.webp";
import Button from "../../../../components/Button/Button";
import { useState } from "react";
import dayjs from "dayjs";
import {
  DatabaseQueryEnum,
  PetsDataType,
  setDataType,
} from "../../../../models";

type Props = {
  modalOpen: boolean;
  petData: PetsDataType | undefined;
  setModalOpen: (props: boolean) => void;
  setData: (data: setDataType) => void;
};

const PillsModadal: React.FC<Props> = ({
  modalOpen,
  petData,
  setModalOpen,
  setData,
}) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const [checkboxes, setCheckboxes] = useState({
    fleas: false,
    worms: false,
    mites: false,
  });

  const checkboxesChange = (key: "fleas" | "worms" | "mites") => {
    setCheckboxes({ ...checkboxes, [key]: !checkboxes[key] });
  };

  const handleClose = () => {
    setName("");
    setDate(dayjs(new Date()).format("YYYY-MM-DD"));
    setCheckboxes({ fleas: false, worms: false, mites: false });
    setModalOpen(false);
  };

  const handleSave = () => {
    if (petData) {
      const data: PetsDataType = {
        ...petData,
        pillsData: [
          ...petData.pillsData,
          {
            date,
            name,
            fleas: checkboxes.fleas,
            mites: checkboxes.mites,
            worms: checkboxes.worms,
          },
        ],
      };
      setData({ data: data, query: DatabaseQueryEnum.PETS, teamId: true });
      handleClose();
    } else {
    }
  };

  return (
    <ModalWrapper modalOpen={modalOpen} width={360} height={243}>
      <h3>Add pils</h3>
      <form className={styles.pillsForm} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Pill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={dayjs(new Date()).format("YYYY-MM-DD")}
        />
        <div className={styles.checkboxes}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="fleas"
              checked={checkboxes.fleas}
              onChange={() => checkboxesChange("fleas")}
            />
            <label htmlFor="fleas">
              Fleas <img src={FleasIcon} alt="" />
            </label>
          </div>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="worms"
              checked={checkboxes.worms}
              onChange={() => checkboxesChange("worms")}
            />
            <label htmlFor="worms">
              Worms <img src={Worms} alt="" />
            </label>
          </div>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="mites"
              checked={checkboxes.mites}
              onChange={() => checkboxesChange("mites")}
            />
            <label htmlFor="mites">
              Mites <img src={Mites} alt="" />
            </label>
          </div>
        </div>
        <div className={styles.buttons}>
          <Button
            text="Save"
            onClick={() => handleSave()}
            nativeType="submit"
            disabled={
              (!checkboxes.fleas && !checkboxes.mites && !checkboxes.worms) ||
              !date
            }
          />
          <Button
            text="Cancel"
            onClick={() => handleClose()}
            type="secondary"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default PillsModadal;
