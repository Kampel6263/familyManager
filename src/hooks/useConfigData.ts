import { useEffect, useState } from "react";
import { collection, Firestore, getDocs } from "firebase/firestore";
import { ConfigType, DatabaseQueryEnum } from "../models";

type Props = {
  db: Firestore;
};

const useConfigHandle = ({ db }: Props) => {
  const [config, setConfig] = useState<ConfigType>({ autoLogout: false });
  useEffect(() => {
    (async () => {
      const result: any = await getDocs(
        collection(db, DatabaseQueryEnum.CONFIG)
      );
      result.forEach((doc: any) => {
        setConfig(doc.data());
      });
    })();
  }, [db]);
  return { config };
};

export default useConfigHandle;
