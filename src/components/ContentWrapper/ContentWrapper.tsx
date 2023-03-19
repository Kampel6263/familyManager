import React from "react";
import { Route, Routes } from "react-router-dom";
import {
  AppDataType,
  DatabaseQueryEnum,
  PriorityEnum,
  setDataType,
} from "../../models";
import TodoList from "../../modules/TodoList/component/TodoList";
import WishList from "../../modules/WishList/component/WishList";
import styles from "./ContentWrapper.module.scss";

type Props = {
  setData: (data: setDataType) => void;
  appData: AppDataType;
};

const ContentWrapper: React.FC<Props> = ({ appData, setData }) => {
  return (
    <div className={styles.content}>
      <Routes>
        <Route path="/" element={<div>Test</div>} />
        <Route
          path="wish-list"
          element={<WishList setData={setData} data={appData.wishList || []} />}
        />
        <Route
          path="todo-list"
          element={<TodoList setData={setData} data={appData.todoList || []} />}
        />
      </Routes>
    </div>
  );
};

export default ContentWrapper;
