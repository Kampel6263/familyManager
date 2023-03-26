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

  // console.log(user, "user");

  const initialAppData: AppDataType = {
    wishList: null,
    todoList: null,
    sibscribers: null,
    userData: null,
    teamData: null,
  };

  const db = getFirestore(app);

  const [modalData, setModalData] = useState<{
    onApplay: () => void;
    onCancel: () => void;
    open: boolean;
    creator: TeamUserDataType;
  } | null>(null);

  const [appData, setAppData] = useState<AppDataType>(initialAppData);

  const { user, login, logout } = useAuth({
    app,
    clearAppData: () => setAppData(initialAppData),
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
        users: [
          { displayName, email, photoURL, uid, verified: true, owner: true },
        ],
      };

      setData({ data: data || teamData, query: DatabaseQueryEnum.TEAMS });
    }
  };

  const getTeamData = async () => {
    const userId = appData.userData!.uid;
    const email = appData.userData!.email;
    const result: any = await getDocs(collection(db, DatabaseQueryEnum.TEAMS));
    const data: TeamDataType[] = [];
    result.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    const myTeam = data.find((el) => el.teamId === userId);

    const otherTeam = data.find((el) =>
      el.users.find((user) => !user.owner && user.email === email)
    );
    console.log(otherTeam, "otherTeam");
    if (otherTeam?.id) {
      const teamUser = otherTeam.users.find((el) => el.email === email);
      if (teamUser?.verified) {
        setAppData({ ...appData, teamData: otherTeam });
      } else {
        const onApplay = () => {
          setTeam({
            ...otherTeam,
            users: otherTeam.users.map((el) =>
              el.email === teamUser?.email
                ? {
                    displayName: appData.userData!.displayName,
                    photoURL: appData.userData!.photoURL,
                    uid: userId,
                    verified: true,
                    email: el.email,
                    owner: el.owner,
                  }
                : el
            ),
          });
          if (myTeam?.id) {
            setData({ data: myTeam.id, query: DatabaseQueryEnum.TEAMS });
          }
          setModalData(null);
        };

        const onCancel = () => {
          setTeam({
            ...otherTeam,
            users: otherTeam.users.filter((el) => el.email !== email),
          });
          setModalData(null);
        };

        setModalData({
          onApplay: () => onApplay(),
          open: true,
          creator: otherTeam.users.find(
            (el) => el.email === otherTeam.creatorEmail
          )!,
          onCancel: () => onCancel(),
        });
      }
    } else if (myTeam?.id) {
      setAppData({ ...appData, teamData: myTeam });
    } else {
      setTeam();
    }
  };

  const addUser = (data: TeamUserDataType) => {
    // remove all teams for this user
    if (appData.teamData) {
      const teamData = appData.teamData;
      setTeam({ ...teamData, users: [...teamData.users, data] });
    }
  };

  useEffect(() => {
    if (appData.userData?.uid) {
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

  return { appData, modalData, setData, login, logout, addUser };
};

export default useDataManage;
