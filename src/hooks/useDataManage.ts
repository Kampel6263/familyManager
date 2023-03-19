import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  AppDataType,
  DatabaseQueryEnum,
  setDataType,
  TodoListDataType,
  WishListType,
} from "../models";

import useInitFirebase from "./useInitFirebase";

const useDataManage = () => {
  const { app } = useInitFirebase();
  const db = getFirestore(app);

  const [appData, setAppData] = useState<AppDataType>({
    wishList: null,
    todoList: null,
  });

  const getData = async (databaseQuery: DatabaseQueryEnum) => {
    const querySnapshot = await getDocs(collection(db, databaseQuery));
    return querySnapshot;
  };

  const setData = async ({ query, data }: setDataType) => {
    try {
      if (typeof data === "string") {
        return await deleteDoc(doc(db, query, data));
      }
      if (data?.id) {
        await updateDoc(doc(db, query, data.id), data);
      } else {
        await addDoc(collection(db, query), data);
      }
    } catch {
    } finally {
      getAllData();
    }
  };

  const getWishListData = async () => {
    const result: any = await getData(DatabaseQueryEnum.WISH_LIST);
    const data: WishListType[] = [];

    result.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    setAppData((prevState) => ({ ...prevState, wishList: data }));
  };

  const getTodoListData = async () => {
    const result: any = await getData(DatabaseQueryEnum.TODO_LIST);
    const data: TodoListDataType[] = [];

    result.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    setAppData((prevState) => ({ ...prevState, todoList: data }));
  };

  const getAllData = async () => {
    await getWishListData();
    await getTodoListData();
  };

  useEffect(() => {
    getAllData();
  }, []);

  return { setData, appData };
};

export default useDataManage;
