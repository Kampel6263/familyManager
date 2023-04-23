import React from "react";
import { Route, Routes, Navigate, redirect } from "react-router-dom";
import {
  AppDataType,
  LoadingState,
  setDataType,
  TeamUserDataType,
} from "../../models";
import Login from "../../modules/Login/component/Login";
import Pets from "../../modules/Pets/component/Pets";
import Sibscribers from "../../modules/Sibscribers/component/Sibscribers";
import Team from "../../modules/Team/component/Team";
import TodoList from "../../modules/TodoList/component/TodoList";
import WishList from "../../modules/WishList/component/WishList";
import Loader from "../Loader/Loader";
import styles from "./ContentWrapper.module.scss";
import RouteWrapper from "../RouteWrapper/RouteWrapper";
import Finances from "../../modules/Finances/component/Finances";
import Payments from "../../modules/Finances/component/Costs/Payments";

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
      {appData?.userData.data?.uid ? (
        <>
          {appData.teamData.data?.teamId ? (
            <Routes>
              <Route path="/" element={<Navigate to={"wish-list"} />} />
              <Route
                path="/finances"
                element={<Navigate to={"/finances/plan"} />}
              />
              <Route
                path="wish-list"
                element={
                  <RouteWrapper state={appData.wishListData.state}>
                    <WishList
                      setData={setData}
                      userId={appData.userData.data.uid}
                      data={appData.wishListData.data || []}
                      teamId={appData.teamData.data?.teamId || ""}
                    />
                  </RouteWrapper>
                }
              />
              <Route
                path="todo-list"
                element={
                  <RouteWrapper state={appData.todoListData.state}>
                    <TodoList
                      setData={setData}
                      data={appData.todoListData.data || []}
                      teamId={appData.teamData.data?.teamId || ""}
                    />
                  </RouteWrapper>
                }
              />
              <Route
                path="sibscribers"
                element={
                  <RouteWrapper state={appData.sibscribersData.state}>
                    <Sibscribers
                      setData={setData}
                      data={appData.sibscribersData.data || []}
                      teamId={appData?.teamData.data?.teamId || ""}
                    />
                  </RouteWrapper>
                }
              />
              <Route path="finances">
                <Route
                  path=":tab"
                  element={
                    <RouteWrapper state={appData.financesData.state}>
                      <Finances
                        costsData={appData.financesData.data || []}
                        teamData={appData.teamData.data}
                        userData={appData.userData.data}
                        setData={setData}
                      />
                    </RouteWrapper>
                  }
                />
                <Route
                  path=":payments/:id"
                  element={
                    <RouteWrapper state={appData.financesData.state}>
                      <Payments
                        teamData={appData.teamData.data}
                        selectedMonth={
                          appData.financesData.data?.find(
                            (el) => el.selected
                          ) || null
                        }
                      />
                    </RouteWrapper>
                  }
                />
              </Route>
              <Route
                path="pets"
                element={
                  <RouteWrapper state={appData.petsData.state}>
                    <Pets
                      petsData={appData.petsData.data || []}
                      setData={setData}
                    />
                  </RouteWrapper>
                }
              />
              <Route
                path="pets/:tab"
                element={
                  <RouteWrapper state={appData.petsData.state}>
                    <Pets
                      petsData={appData.petsData.data || []}
                      setData={setData}
                    />
                  </RouteWrapper>
                }
              />
              <Route
                path="team"
                element={
                  <RouteWrapper state={appData.teamData.state}>
                    <Team
                      teamData={appData.teamData.data}
                      userData={appData.userData.data}
                      addUser={addUser}
                    />
                  </RouteWrapper>
                }
              />
              Team
            </Routes>
          ) : (
            <Loader state={LoadingState.LOADING} />
          )}
        </>
      ) : (
        <Login login={login} />
      )}
    </div>
  );
};

export default ContentWrapper;
