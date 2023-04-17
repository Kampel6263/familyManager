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
  LoadingState,
  setDataType,
  SibscribersDataType,
  TeamDataType,
  TeamUserDataType,
  TodoListDataType,
  WishListType,
} from "../models";
import useAuth from "./useAuth";

import useInitFirebase from "./useInitFirebase";
import usePetsData from "./usePetsData";
import useTeamData from "./useTeamData";
import useFinancesData from "./useFinancesData";

const useDataManage = () => {
  const { app } = useInitFirebase();

  const initialAppData: AppDataType = {
    wishListData: {
      data: null,
      state: LoadingState.LOADING,
    },
    todoListData: {
      data: null,
      state: LoadingState.LOADING,
    },
    sibscribersData: {
      data: null,
      state: LoadingState.LOADING,
    },
    userData: {
      data: null,
      state: LoadingState.LOADING,
    },
    teamData: {
      data: null,
      state: LoadingState.LOADING,
    },
    petsData: {
      data: null,
      state: LoadingState.LOADING,
    },
    financesData: {
      data: null,
      state: LoadingState.LOADING,
    },
  };

  const db = getFirestore(app);

  const [appData, setAppData] = useState<AppDataType>(initialAppData);

  const { user, login, logout } = useAuth({
    app,
    clearAppData: () => setAppData(initialAppData),
  });

  useEffect(() => {
    setAppData({
      ...appData,
      userData: { data: user, state: LoadingState.LOADED },
    });
  }, [user]);

  const getData = async (databaseQuery: DatabaseQueryEnum) => {
    const querySnapshot = await getDocs(
      collection(db, `${databaseQuery}-${appData.teamData.data!.teamId}`)
    );
    return querySnapshot;
  };

  const setData = async ({ query, data, teamId }: setDataType) => {
    try {
      if (typeof data === "string") {
        return await deleteDoc(
          doc(
            db,
            `${query}${teamId ? "-" + appData.teamData.data!.teamId : ""}`,
            data
          )
        );
      }
      if (data?.id) {
        await updateDoc(
          doc(
            db,
            `${query}${teamId ? "-" + appData.teamData.data!.teamId : ""}`,
            data.id
          ),
          data
        );
      } else {
        await addDoc(
          collection(
            db,
            `${query}${teamId ? "-" + appData.teamData.data!.teamId : ""}`
          ),
          data
        );
      }
    } catch {
    } finally {
      switch (query) {
        case DatabaseQueryEnum.WISH_LIST:
          return await getWishListData();
        case DatabaseQueryEnum.TODO_LIST:
          return await getTodoListData();
        case DatabaseQueryEnum.SIBSCRIBERS:
          return await getSibscribersData();
        case DatabaseQueryEnum.TEAMS:
          return await getTeamData();
        case DatabaseQueryEnum.PETS:
          return await getPetsData();
        case DatabaseQueryEnum.FINANCES:
          return await getFinancesData();
      }
    }
  };
  const { modalData, getTeamData, addUser } = useTeamData({
    appData,
    db,
    setAppData,
    setData,
  });

  const { getPetsData } = usePetsData({ getData, setAppData });
  useEffect(() => {
    if (appData.userData.data?.uid) {
      getTeamData();
    }
  }, [appData.userData?.data?.uid]);

  const { getFinancesData } = useFinancesData({ getData, setAppData });

  const getWishListData = async () => {
    const result: any = await getData(DatabaseQueryEnum.WISH_LIST);
    const data: WishListType[] = [];

    result.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    setAppData((prevState) => ({
      ...prevState,
      wishListData: {
        data: data,
        state: data.length ? LoadingState.LOADED : LoadingState.NO_DATA,
      },
    }));
  };

  const getTodoListData = async () => {
    const result: any = await getData(DatabaseQueryEnum.TODO_LIST);
    const data: TodoListDataType[] = [];

    result.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    setAppData((prevState) => ({
      ...prevState,
      todoListData: {
        data: data,
        state: data.length ? LoadingState.LOADED : LoadingState.NO_DATA,
      },
    }));
  };
  const getSibscribersData = async () => {
    const result: any = await getData(DatabaseQueryEnum.SIBSCRIBERS);
    const data: SibscribersDataType[] = [];

    result.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    setAppData((prevState) => ({
      ...prevState,
      sibscribersData: {
        data: data,
        state: data.length ? LoadingState.LOADED : LoadingState.NO_DATA,
      },
    }));
  };

  const getAllData = async () => {
    await Promise.all([
      await getWishListData(),
      await getTodoListData(),
      await getSibscribersData(),
      await getPetsData(),
      await getFinancesData(),
    ]);
  };

  useEffect(() => {
    if (appData.teamData.data?.teamId) {
      getAllData();
    }
  }, [appData.teamData.data?.teamId]);

  return { appData, modalData, setData, login, logout, addUser };
};

export default useDataManage;
