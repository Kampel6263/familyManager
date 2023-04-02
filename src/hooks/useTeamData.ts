import { collection, Firestore, getDocs } from "firebase/firestore";
import { useState } from "react";
import {
  AppDataType,
  DatabaseQueryEnum,
  LoadingState,
  setDataType,
  TeamDataType,
  TeamUserDataType,
} from "../models";

type Props = {
  appData: AppDataType;
  setAppData: (props: AppDataType) => void;
  db: Firestore;

  setData: (props: setDataType) => void;
};

const useTeamData = ({ appData, db, setData, setAppData }: Props) => {
  const [modalData, setModalData] = useState<{
    onApplay: () => void;
    onCancel: () => void;
    open: boolean;
    creator: TeamUserDataType;
  } | null>(null);
  const setTeam = (data?: TeamDataType) => {
    if (appData.userData.data) {
      const { displayName, email, photoURL, uid } = appData.userData.data;
      const teamData: TeamDataType = {
        creatorEmail: appData.userData.data!.email,
        id: "",
        teamId: appData.userData.data!.uid,
        users: [
          { displayName, email, photoURL, uid, verified: true, owner: true },
        ],
      };

      setData({ data: data || teamData, query: DatabaseQueryEnum.TEAMS });
    }
  };
  const getTeamData = async () => {
    const userId = appData.userData.data!.uid;
    const email = appData.userData.data!.email;
    const result: any = await getDocs(collection(db, DatabaseQueryEnum.TEAMS));
    const data: TeamDataType[] = [];
    result.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    const myTeam = data.find((el) => el.teamId === userId);

    const otherTeam = data.find((el) =>
      el.users.find((user) => !user.owner && user.email === email)
    );

    if (otherTeam?.id) {
      const teamUser = otherTeam.users.find((el) => el.email === email);
      if (teamUser?.verified) {
        setAppData({
          ...appData,
          teamData: { state: LoadingState.LOADED, data: otherTeam },
        });
      } else {
        const onApplay = () => {
          setTeam({
            ...otherTeam,
            users: otherTeam.users.map((el) =>
              el.email === teamUser?.email
                ? {
                    displayName: appData.userData.data!.displayName,
                    photoURL: appData.userData.data!.photoURL,
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
      setAppData({
        ...appData,
        teamData: {
          state: data.length ? LoadingState.LOADED : LoadingState.NO_DATA,
          data: myTeam,
        },
      });
    } else {
      setTeam();
    }
  };
  const addUser = (data: TeamUserDataType) => {
    if (appData.teamData.data) {
      const teamData = appData.teamData.data;
      setTeam({ ...teamData, users: [...teamData.users, data] });
    }
  };
  return { modalData, addUser, getTeamData };
};
export default useTeamData;
