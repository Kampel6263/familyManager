export enum DatabaseQueryEnum {
  WISH_LIST = "wish-list",
  TODO_LIST = "todo-list",
  SIBSCRIBERS = "sibscribers",
  TEAMS = "teams",
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
  id?: string;
};

export type TodoListDataType = {
  name: string;
  done: boolean;
  id?: string;
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
  id?: string;
};

export interface UserDataType {
  email: string;
  photoURL: string;
  displayName: string;
  uid: string;
}

export interface TeamUserDataType extends UserDataType {
  verified: boolean;
}

export type TeamDataType = {
  teamId: string;
  users: TeamUserDataType[];
  creatorEmail: string;
  id: string;
};

export type AppDataType = {
  wishList: WishListType[] | null;
  todoList: TodoListDataType[] | null;
  sibscribers: SibscribersDataType[] | null;
  userData: UserDataType | null;
  teamData: TeamDataType | null;
};

export type setDataType = {
  query: DatabaseQueryEnum;
  teamId?: string;
  data: any;
};
