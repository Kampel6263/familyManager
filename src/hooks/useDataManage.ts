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
  SibscribersDataType,
  TeamDataType,
  TeamUserDataType,
  TodoListDataType,
  WishListType,
} from "../models";
import useAuth from "./useAuth";

import useInitFirebase from "./useInitFirebase";

const useDataManage = () => {
  const { app } = useInitFirebase();

  const { user, login, logout } = useAuth({ app });

  // console.log(user, "user");

  const db = getFirestore(app);

  const [appData, setAppData] = useState<AppDataType>({
    wishList: null,
    todoList: null,
    sibscribers: null,
    userData: null,
    teamData: null,
  });

  useEffect(() => {
    setAppData({ ...appData, userData: user });
  }, [user]);

  const getData = async (databaseQuery: DatabaseQueryEnum) => {
    const querySnapshot = await getDocs(
      collection(db, `${databaseQuery}-${appData.teamData!.teamId}`)
    );
    return querySnapshot;
  };

  const setData = async ({ query, data, teamId }: setDataType) => {
    try {
      if (typeof data === "string") {
        return await deleteDoc(
          doc(db, `${query}${teamId ? "-" + teamId : ""}`, data)
        );
      }
      if (data?.id) {
        await updateDoc(
          doc(db, `${query}${teamId ? "-" + teamId : ""}`, data.id),
          data
        );
      } else {
        await addDoc(
          collection(db, `${query}${teamId ? "-" + teamId : ""}`),
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
      }
    }
  };

  const setTeam = (data?: TeamDataType) => {
    if (appData.userData) {
      const { displayName, email, photoURL, uid } = appData.userData;
      const teamData: TeamDataType = {
        creatorEmail: appData.userData!.email,
        id: "",
        teamId: appData.userData!.uid,
        users: [{ displayName, email, photoURL, uid, verified: true }],
      };
      console.log("settt", teamData);
      setData({ data: data || teamData, query: DatabaseQueryEnum.TEAMS });
    }
  };

  const test = () => {};

  const getTeamData = async () => {
    const userId = appData.userData!.uid;
    const email = appData.userData!.email;
    const result: any = await getDocs(collection(db, DatabaseQueryEnum.TEAMS));
    const data: TeamDataType[] = [];
    result.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    const myTeamData = data.find(
      (el) => el.teamId === userId || el.users.find((el) => el.email === email)
    );

    if (myTeamData?.teamId) {
      if (myTeamData.teamId !== userId) {
        const userData = myTeamData.users.find((el) => el.email === email);

        if (!userData?.verified) {
          setTeam({
            ...myTeamData,
            users: myTeamData.users.map((el) =>
              el.email === email && !el.verified
                ? {
                    displayName: appData.userData!.displayName,
                    photoURL: appData.userData!.photoURL,
                    uid: userId,
                    verified: true,
                    email: el.email,
                  }
                : el
            ),
          });
          const oldTeam = data.find((el) => el.teamId === userId);
          if (oldTeam?.id) {
            setData({ data: oldTeam.id, query: DatabaseQueryEnum.TEAMS });
          }
        }
      }
      setAppData({ ...appData, teamData: myTeamData });
    } else {
      setTeam();
    }
  };

  const addUser = (data: TeamUserDataType) => {
    if (appData.teamData) {
      const teamData = appData.teamData;
      setTeam({ ...teamData, users: [...teamData.users, data] });
    }
  };

  useEffect(() => {
    if (appData.userData?.uid) {
      console.log("get team data");

      getTeamData();
    }
  }, [appData.userData?.uid]);

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
  const getSibscribersData = async () => {
    const result: any = await getData(DatabaseQueryEnum.SIBSCRIBERS);
    const data: SibscribersDataType[] = [];

    result.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    setAppData((prevState) => ({ ...prevState, sibscribers: data }));
  };

  const getAllData = async () => {
    await Promise.all([
      await getWishListData(),
      await getTodoListData(),
      await getSibscribersData(),
    ]);
  };

  useEffect(() => {
    if (appData.teamData?.teamId) {
      getAllData();
    }
  }, [appData.teamData?.teamId]);

  return { appData, setData, login, logout, addUser };
};

export default useDataManage;
