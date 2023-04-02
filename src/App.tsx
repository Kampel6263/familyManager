import React from "react";
import styles from "./App.module.scss";
import Button from "./components/Button/Button";
import ContentWrapper from "./components/ContentWrapper/ContentWrapper";
import Header from "./components/Header/Header";
import ModalWrapper from "./components/ModalWrapper/ModalWrapper";
import Navbar from "./components/Navbar/Navbar";
import useDataManage from "./hooks/useDataManage";

const App: React.FC = () => {
  const { appData, modalData, setData, login, logout, addUser } =
    useDataManage();
  return (
    <div className={styles.app}>
      <Header userData={appData.userData.data} logout={logout} />
      <div className={styles.block}>
        {appData?.userData && <Navbar />}

        <ContentWrapper
          setData={setData}
          appData={appData}
          login={login}
          addUser={addUser}
        />
      </div>

      <ModalWrapper modalOpen={!!modalData?.open} height={175}>
        <div className={styles.modal}>
          <img src={modalData?.creator.photoURL} alt="" />
          <div>
            {modalData?.creator.displayName || modalData?.creator.email}
          </div>
          <div className={styles.text}>Join to my team!</div>
          <div className={styles.buttons}>
            <Button text="Accept" onClick={() => modalData?.onApplay()} />
            <Button
              text="Cancel"
              onClick={() => modalData?.onCancel()}
              type={"secondary"}
            />
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
};

export default App;
