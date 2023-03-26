import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AppDataType, setDataType, TeamUserDataType } from "../../models";
import Login from "../../modules/Login/component/Login";
import Sibscribers from "../../modules/Sibscribers/component/Sibscribers";
import Team from "../../modules/Team/component/Team";
import TodoList from "../../modules/TodoList/component/TodoList";
import WishList from "../../modules/WishList/component/WishList";
import Loader from "../Loader/Loader";
import styles from "./ContentWrapper.module.scss";

type Props = {
  setData: (data: setDataType) => void;
  appData: AppDataType;
  login: () => any;
  addUser: (data: TeamUserDataType) => any;
};

const ContentWrapper: React.FC<Props> = ({
  appData,
  setData,
  login,
  addUser,
}) => {
  return (
    <div className={styles.content}>
      {appData?.userData?.uid ? (
        <>
          {appData.teamData?.teamId ? (
            <Routes>
              <Route path="/" element={<Navigate to={"wish-list"} />} />
              <Route
                path="wish-list"
                element={
                  <WishList
                    setData={setData}
                    data={appData.wishList || []}
                    teamId={appData.teamData?.teamId || ""}
                  />
                }
              />
              <Route
                path="todo-list"
                element={
                  <TodoList
                    setData={setData}
                    data={appData.todoList || []}
                    teamId={appData.teamData?.teamId || ""}
                  />
                }
              />
              <Route
                path="sibscribers"
                element={
                  <Sibscribers
                    setData={setData}
                    data={appData.sibscribers || []}
                    teamId={appData?.teamData?.teamId || ""}
                  />
                }
              />
              <Route
                path="team"
                element={
                  <Team
                    teamData={appData.teamData}
                    userData={appData.userData}
                    addUser={addUser}
                  />
                }
              />
              Team
            </Routes>
          ) : (
            <Loader />
          )}
        </>
      ) : (
        <Login login={login} />
      )}
    </div>
  );
};

export default ContentWrapper;
