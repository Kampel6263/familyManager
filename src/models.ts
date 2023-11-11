import { CostsDataType } from "./modules/Finances/models/costs";

export enum DatabaseQueryEnum {
  WISH_LIST = "wish-list",
  TODO_LIST = "todo-list",
  SIBSCRIBERS = "sibscribers",
  TEAMS = "teams",
  PETS = "pets",
  FINANCES = "finances",
}

export enum PriorityEnum {
  VERY_LOW = 0,
  LOW = 1,
  MEDIUM = 2,
  CRITICAL = 3,
}

export type TypeFilter = "general" | "home" | "personal";

export type WishListType = {
  name: string;
  priority: PriorityEnum;
  sum: number;
  type: TypeFilter;
  done: boolean;
  id: string;
  userId: string;
};

export type TodoListDataType = {
  categoryName: string;
  categoryColor: string;
  data: { name: string; done: boolean }[];
  lastUpdate: string;
  id: string;
};

export type ServiceType = {
  label: string;
  value: string;
  img: string;
};

export type SibscribersDataType = {
  service: string;
  type: string;
  cost: number;
  monthNumber: number;
  id: string;
};

export interface UserDataType {
  email: string;
  photoURL: string;
  displayName: string;
  uid: string;
}

export interface TeamUserDataType extends UserDataType {
  verified: boolean;
  owner: boolean;
}

export type TeamDataType = {
  teamId: string;
  users: TeamUserDataType[];
  creatorEmail: string;
  id: string;
};
export type PillsHistory = {
  name: string;
  date: string;
  fleas: boolean;
  worms: boolean;
  mites: boolean;
};

export type PetsDataType = {
  name: string;
  birthday: string;
  sex: string;
  breed: string;
  petType: string;
  lastVaccination: string;
  nextVaccination: string;
  pillsData: PillsHistory[];
  id: string;
};

export enum LoadingState {
  LOADING,
  LOADED,
  NO_DATA,
}

export type AppDataType = {
  lastUpdate: string;
  wishListData: {
    data: WishListType[] | null;
    state: LoadingState;
  };

  todoListData: {
    data: TodoListDataType[] | null;
    state: LoadingState;
  };

  sibscribersData: {
    data: SibscribersDataType[] | null;
    state: LoadingState;
  };
  userData: {
    data: UserDataType | null;
    state: LoadingState;
  };
  petsData: {
    data: PetsDataType[] | null;
    state: LoadingState;
  };
  teamData: {
    data: TeamDataType | null;
    state: LoadingState;
  };
  financesData: {
    data: CostsDataType[] | null;
    state: LoadingState;
  };
};

export type setDataType = {
  query: DatabaseQueryEnum;
  teamId?: boolean;
  data: any;
};
