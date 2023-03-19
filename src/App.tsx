import React, { useEffect } from "react";
import styles from "./App.module.scss";
import ContentWrapper from "./components/ContentWrapper/ContentWrapper";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import useDataManage from "./hooks/useDataManage";
const App: React.FC = () => {
  const { setData, appData } = useDataManage();
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.block}>
        <Navbar />
        <ContentWrapper setData={setData} appData={appData} />
      </div>
    </div>
  );
};

export default App;
