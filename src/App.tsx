import React, { useEffect } from "react";
import styles from "./App.module.scss";
import ContentWrapper from "./components/ContentWrapper/ContentWrapper";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import useDataManage from "./hooks/useDataManage";

const App: React.FC = () => {
  const { appData, setData, login, logout, addUser } = useDataManage();
  console.log(appData, "appData");
  return (
    <div className={styles.app}>
      <Header userData={appData.userData} logout={logout} />
      <div className={styles.block}>
        {appData?.userData && <Navbar />}

        <ContentWrapper
          setData={setData}
          appData={appData}
          login={login}
          addUser={addUser}
        />
      </div>
    </div>
  );
};

export default App;
