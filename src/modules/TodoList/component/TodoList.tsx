import classNames from "classnames";
import {
  LegacyRef,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Button from "../../../components/Button/Button";
import Table from "../../../components/Table/Table";
import {
  DatabaseQueryEnum,
  setDataType,
  TodoListDataType,
} from "../../../models";
import styles from "./TodoList.module.scss";

type Props = {
  teamId: string;
  data: TodoListDataType[];
  setData: (data: setDataType) => void;
};

const TodoList: React.FC<Props> = ({ data, teamId, setData }) => {
  const sortedData = data.sort((a, b) => {
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

  const [showInput, setShowInput] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const [selectedId, setSelectedId] = useState("");

  const [scrollWidth, setScrollWidth] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    setScrollWidth(ref.current?.scrollWidth || 0);
  }, []);

  const handleCancel = () => {
    setInputValue("");
    setShowInput(false);
    setSelectedId("");
  };

  const handleSave = (done = false, name = inputValue, id = selectedId) => {
    setData({
      query: DatabaseQueryEnum.TODO_LIST,
      data: { name, done, id },
      teamId,
    });
    handleCancel();
  };

  const handleRemove = (id: string) => {
    setData({
      query: DatabaseQueryEnum.TODO_LIST,
      data: id,
      teamId,
    });
  };

  const doneItemsCount = data.reduce((accum, curr) => {
    return curr.done ? ++accum : accum;
  }, 0);

  return (
    <div>
      <div className={styles.header}>
        <h2>Todo list({data.length})</h2>
        <Button text="Add new" onClick={() => setShowInput(true)} />
      </div>

      <div className={styles.proggres} ref={ref}>
        <div className={styles.text}>
          <b>
            {doneItemsCount}/{data.length}
          </b>
          &nbsp;
          <span>
            ({((doneItemsCount / data.length) * 100 || 0).toFixed(1)}%)
          </span>
        </div>
        <div
          className={styles.bar}
          style={{
            width: scrollWidth * (doneItemsCount / data.length) || 0,
          }}
        ></div>
      </div>

      <Table
        loading={!data || data.length === 0}
        children={
          <>
            <div className={styles.item}>
              <div>Name</div>
              <div>Action</div>
            </div>
            {showInput && (
              <div className={styles.item}>
                <input
                  type="text"
                  placeholder="Input name"
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className={styles.action}>
                  <Button text="Save" onClick={() => handleSave()} />
                  <Button
                    text="Cancel"
                    onClick={() => handleCancel()}
                    type={"secondary"}
                  />
                </div>
              </div>
            )}
            {sortedData.map((el, i) => {
              const editMode = selectedId === el.id;

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
                        setSelectedId(el.id || "");
                        setInputValue(el.name);
                      }}
                      className={el.done || editMode ? styles.done : ""}
                    >
                      Edit
                    </span>
                    <span
                      onClick={() =>
                        editMode ? handleSave() : handleRemove(el.id || "")
                      }
                      className={el.done ? styles.done : ""}
                    >
                      {editMode ? "Save" : "Remove"}{" "}
                    </span>
                    <span
                      onClick={() =>
                        editMode
                          ? handleCancel()
                          : handleSave(!el.done, el.name, el.id)
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
    </div>
  );
};

export default TodoList;
