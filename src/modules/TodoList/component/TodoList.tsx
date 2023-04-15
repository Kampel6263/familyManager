import classNames from "classnames";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Button from "../../../components/Button/Button";
import Table from "../../../components/Table/Table";
import {
  DatabaseQueryEnum,
  LoadingState,
  setDataType,
  TodoListDataType,
} from "../../../models";
import styles from "./TodoList.module.scss";
import ModalWrapper from "../../../components/ModalWrapper/ModalWrapper";
import Loader from "../../../components/Loader/Loader";

type Props = {
  teamId: string;
  data: TodoListDataType[];

  setData: (data: setDataType) => void;
};

const TodoList: React.FC<Props> = ({ data, teamId, setData }) => {
  const [selectedCategory, setSelectedCategory] =
    useState<TodoListDataType | null>(null);

  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (data?.length) {
      setSelectedCategory(data.find((el) => el.id === selectedId) || data[0]);
    } else {
      setSelectedCategory(null);
    }
  }, [data]);

  const colors = [
    "#E14F62",
    "#82D4F7",
    "#F2C94C",
    "#94CA42",
    "#55B5A6",
    "#4E80EE",
    "#845EEE",
    "#C951E7",
    "#DA5597",
    "#9ba4aa",
  ];

  const sortedData = selectedCategory?.data.sort((a, b) => {
    if (a.done && b.done) {
      return 0;
    }
    if (a.done) {
      return 1;
    }
    if (b.done) {
      return -1;
    }

    return 0;
  });

  const [inputValue, setInputValue] = useState("");

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [scrollWidth, setScrollWidth] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    setScrollWidth(ref.current?.scrollWidth || 0);
  }, []);

  const handleCancel = () => {
    setInputValue("");
    setSelectedIndex(null);
  };

  const [newCategoryData, setNewCategoryData] = useState<{
    categoryName: string;
    categoryColor: string;
    mode: "edit" | "create" | null;
  }>({ categoryColor: colors[0], categoryName: "", mode: null });

  const handleCloseModal = () => {
    setNewCategoryData({
      categoryColor: colors[0],
      categoryName: "",
      mode: null,
    });
  };

  const addCategory = () => {
    if (newCategoryData) {
      const newCategory: TodoListDataType = {
        categoryColor: newCategoryData.categoryColor,
        categoryName: newCategoryData.categoryName,
        id: newCategoryData.mode === "create" ? "" : selectedCategory!.id,
        data: newCategoryData.mode === "create" ? [] : selectedCategory!.data,
      };

      setData({
        data: newCategory,
        query: DatabaseQueryEnum.TODO_LIST,
        teamId: true,
      });
    }
    handleCloseModal();
  };

  const handleSave = (done = false, name = inputValue, index?: number) => {
    if (selectedCategory && name) {
      const newData: TodoListDataType = {
        ...selectedCategory,
        data:
          index || index === 0
            ? selectedCategory.data.map((el, i) =>
                i === index ? { done, name } : el
              )
            : [...selectedCategory.data, { done, name }],
      };
      setData({
        query: DatabaseQueryEnum.TODO_LIST,
        data: newData,
        teamId: true,
      });
      handleCancel();
    }
  };

  const handleRemove = (index: number) => {
    if (selectedCategory) {
      const newData: TodoListDataType = {
        ...selectedCategory,
        data: selectedCategory.data.filter((el, i) => i !== index),
      };

      setData({
        query: DatabaseQueryEnum.TODO_LIST,
        data: newData,
        teamId: true,
      });
    }
  };

  const doneItemsCount = selectedCategory
    ? selectedCategory?.data.reduce((accum, curr) => {
        return curr.done ? ++accum : accum;
      }, 0)
    : 0;

  return (
    <>
      <h2>
        {selectedCategory ? (
          <div className={styles.topHeader}>
            <div>
              {selectedCategory.categoryName} - {selectedCategory.data.length}
            </div>
            <Button
              text="Edit category"
              onClick={() => {
                setNewCategoryData({
                  categoryColor: selectedCategory.categoryColor,
                  categoryName: selectedCategory.categoryName,
                  mode: "edit",
                });
              }}
              type="primary"
            />
          </div>
        ) : (
          "Tasks"
        )}
      </h2>

      <div
        className={classNames(styles.proggres, doneItemsCount && styles.show)}
        style={{ background: selectedCategory?.categoryColor + "30" }}
        ref={ref}
      >
        <div className={styles.text}>
          <b>
            {doneItemsCount}/{selectedCategory?.data.length}
          </b>
          &nbsp;
          <span>
            (
            {(
              (doneItemsCount / (selectedCategory?.data?.length || 0)) * 100 ||
              0
            ).toFixed(1)}
            %)
          </span>
        </div>
        <div
          className={styles.bar}
          style={{
            width:
              scrollWidth *
              (doneItemsCount / (selectedCategory?.data?.length || 0)),
            background: selectedCategory?.categoryColor,
          }}
        ></div>
      </div>
      <div
        className={classNames(
          styles.content,
          !selectedCategory && styles.noData
        )}
      >
        <Table
          state={!selectedCategory ? LoadingState.NO_DATA : LoadingState.LOADED}
          children={
            <>
              <div className={styles.item}>
                <div>Name</div>
                <div>Action</div>
              </div>

              <div className={styles.item}>
                <form
                  style={{ width: "100%" }}
                  action=""
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Add new"
                    autoFocus
                    disabled={!!selectedIndex || selectedIndex === 0}
                    value={
                      selectedIndex || selectedIndex === 0 ? "" : inputValue
                    }
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </form>

                {/* <div className={styles.action}>
                  <Button text="+" onClick={() => handleSave()} />
                </div> */}
              </div>

              {sortedData?.map((el, i) => {
                const editMode = selectedIndex === i;

                return (
                  <div
                    key={el.name + i}
                    className={classNames(styles.item, el.done && styles.done)}
                  >
                    {editMode ? (
                      <input
                        type="text"
                        placeholder="Input name"
                        autoFocus
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    ) : (
                      <div>{el.name}</div>
                    )}
                    <div className={styles.action}>
                      <span
                        onClick={() => {
                          setSelectedIndex(i);
                          setInputValue(el.name);
                        }}
                        className={el.done || editMode ? styles.done : ""}
                      >
                        Edit
                      </span>
                      <span
                        onClick={() =>
                          editMode
                            ? handleSave(undefined, undefined, i)
                            : handleRemove(i)
                        }
                        className={el.done ? styles.done : ""}
                      >
                        {editMode ? "Save" : "Remove"}
                      </span>
                      <span
                        onClick={() =>
                          editMode
                            ? handleCancel()
                            : handleSave(!el.done, el.name, i)
                        }
                      >
                        {editMode ? "X" : el.done ? "⤽" : "✓"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          }
        />
        <div className={classNames(styles.categories, "scrollbar")}>
          <div className={styles.header}>
            <h3>Categories</h3>
            <Button
              text="Add"
              onClick={() =>
                setNewCategoryData((prevState) => ({
                  ...prevState,
                  mode: "create",
                }))
              }
              type="primary"
            />
          </div>
          {data.length ? (
            <div className={styles.list}>
              {data.map((el) => (
                <div
                  className={styles.category}
                  onClick={() => {
                    setSelectedCategory(el);
                    setSelectedId(el.id);
                  }}
                  style={{
                    borderColor: el.categoryColor,
                    background:
                      selectedCategory?.id === el.id
                        ? el.categoryColor + "10"
                        : "",
                  }}
                >
                  <div className={styles.title}>
                    <div
                      className={styles.titleColor}
                      style={{ background: el.categoryColor }}
                    ></div>
                    {el.categoryName} - {el.data.length}
                  </div>

                  <Button
                    text=""
                    type="remove"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setData({
                        data: el.id,
                        query: DatabaseQueryEnum.TODO_LIST,
                        teamId: true,
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Loader state={LoadingState.NO_DATA} />
          )}
        </div>
      </div>
      <ModalWrapper modalOpen={!!newCategoryData.mode} height={212}>
        <h3>Add new category</h3>
        <form
          className={styles.categoryModal}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={newCategoryData?.categoryName}
            onChange={(e) =>
              setNewCategoryData({
                ...newCategoryData,
                categoryName: e.target.value,
              })
            }
            placeholder="Category name"
          />
          <div className={styles.colors}>
            {colors.map((color) => {
              return (
                <div
                  className={classNames(
                    styles.color,
                    newCategoryData.categoryColor.toLowerCase() ===
                      color.toLowerCase() && styles.active
                  )}
                  style={{ background: color, borderColor: color }}
                  onClick={() =>
                    setNewCategoryData({
                      ...newCategoryData,
                      categoryColor: color,
                    })
                  }
                >
                  <div
                    className={styles.border}
                    style={{ border: `1px solid ${color}` }}
                  ></div>
                </div>
              );
            })}

            <div className={styles.color}>
              <label
                htmlFor="custom"
                className={classNames(styles.color, styles.custom)}
              >
                Custom
              </label>
              <input
                id="custom"
                type="color"
                value={newCategoryData.categoryColor}
                onChange={(e) =>
                  setNewCategoryData({
                    ...newCategoryData,
                    categoryColor: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className={styles.buttons}>
            <Button
              text={newCategoryData.mode === "create" ? "Create" : "Save"}
              onClick={() => addCategory()}
              disabled={!newCategoryData.categoryName}
              nativeType="submit"
            />
            <Button
              text="Cancel"
              onClick={() => handleCloseModal()}
              type="secondary"
            />
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default TodoList;
