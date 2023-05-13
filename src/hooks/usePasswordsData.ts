import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { AppDataType, DatabaseQueryEnum, LoadingState } from "../models";

export type PasswordsDataType = {
  name: string;
  date: string;
  password: string;
  private: boolean;
  userId: string;
  id: string;
};

type Props = {
  setAppData: (props: React.SetStateAction<AppDataType>) => void;
  getData: (
    databaseQuery: DatabaseQueryEnum
  ) => Promise<QuerySnapshot<DocumentData>>;
};

const usePasswordsData = ({ setAppData, getData }: Props) => {
  const getPasswordsData = async () => {
    const result: any = await getData(DatabaseQueryEnum.PASSWORDS);
    const data: PasswordsDataType[] = [];

    result.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    setAppData((prevState) => ({
      ...prevState,
      passwordsData: {
        state: data.length ? LoadingState.LOADED : LoadingState.NO_DATA,
        data: data,
      },
    }));
  };
  return { getPasswordsData };
};

export default usePasswordsData;
