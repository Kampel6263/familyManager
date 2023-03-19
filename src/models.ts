export enum DatabaseQueryEnum {
  WISH_LIST = "wish-list",
  TODO_LIST = "todo-list",
}

export enum PriorityEnum {
  VERY_LOW = 0,
  LOW = 1,
  MEDIUM = 2,
  CRITICAL = 3,
}

export type TypeFilter = "general" | "home";

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

export type AppDataType = {
  wishList: WishListType[] | null;
  todoList: TodoListDataType[] | null;
};

export type setDataType = {
  query: DatabaseQueryEnum;
  data: any;
};
