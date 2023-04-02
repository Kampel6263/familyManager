import classNames from "classnames";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingState, PetsDataType, setDataType } from "../../../models";
import { getIconByPetType } from "../helpers/main";
import CreateViewPet from "./CreateViewPet";
import styles from "./Pets.module.scss";
import PlaceholderIcon from "../../../assets/globalImgs/petPlaceholder.png";
import Loader from "../../../components/Loader/Loader";

type Props = {
  petsData: PetsDataType[];
  setData: (data: setDataType) => void;
};

const Pets: React.FC<Props> = ({ petsData, setData }) => {
  const { tab } = useParams();
  const navigate = useNavigate();

  return (
    <>
      {tab ? (
        <CreateViewPet data={petsData} tab={tab} setData={setData} />
      ) : (
        <>
          <h2>Pets</h2>
          <div className={styles.pets}>
            {petsData.map((el) => (
              <div
                className={classNames(styles.pet, styles[el.sex])}
                onClick={() => navigate(el.id)}
              >
                <div className={styles.info}>
                  <img
                    src={getIconByPetType(el.petType) || PlaceholderIcon}
                    alt=""
                  />
                  <div className={styles.name}>{el.name}</div>
                  <div>{el.breed}</div>
                </div>
              </div>
            ))}
            <div
              className={classNames(styles.pet, styles.addPet)}
              onClick={() => navigate("create")}
            >
              + Create
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Pets;
