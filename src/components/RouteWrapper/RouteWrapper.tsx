import React, { ReactNode } from "react";
import styles from "./RouteWrapper.module.scss";
import { LoadingState } from "../../models";
import Loader from "../Loader/Loader";

type Props = {
  children: ReactNode;
  state: LoadingState;
};

const RouteWrapper: React.FC<Props> = ({ children, state }) => {
  return state === LoadingState.LOADING ? (
    <Loader state={LoadingState.LOADING} />
  ) : (
    <>{children}</>
  );
};

export default RouteWrapper;
