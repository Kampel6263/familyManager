import { DocumentData, QuerySnapshot } from "firebase/firestore";
import {
  AppDataType,
  DatabaseQueryEnum,
  LoadingState,
  PetsDataType,
} from "../models";

type Props = {
  setAppData: (props: React.SetStateAction<AppDataType>) => void;
  getData: (
    databaseQuery: DatabaseQueryEnum
  ) => Promise<QuerySnapshot<DocumentData>>;
};

const usePetsData = ({ setAppData, getData }: Props) => {
  const getPetsData = async () => {
    const result: any = await getData(DatabaseQueryEnum.PETS);
    const data: PetsDataType[] = [];

    result.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    setAppData((prevState) => ({
      ...prevState,
      petsData: {
        state: data.length ? LoadingState.LOADED : LoadingState.NO_DATA,
        data: data,
      },
    }));
  };
  return { getPetsData };
};

export default usePetsData;
