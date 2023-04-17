import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { AppDataType, DatabaseQueryEnum, LoadingState } from "../models";
import { CostsDataType } from "../modules/Finances/models/costs";

type Props = {
  setAppData: (props: React.SetStateAction<AppDataType>) => void;
  getData: (
    databaseQuery: DatabaseQueryEnum
  ) => Promise<QuerySnapshot<DocumentData>>;
};

const useFinancesData = ({ setAppData, getData }: Props) => {
  const getFinancesData = async () => {
    const result: any = await getData(DatabaseQueryEnum.FINANCES);
    const data: CostsDataType[] = [];

    result.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    setAppData((prevState) => ({
      ...prevState,
      financesData: {
        state: data.length ? LoadingState.LOADED : LoadingState.NO_DATA,
        data: data,
      },
    }));
  };
  return { getFinancesData };
};

export default useFinancesData;
