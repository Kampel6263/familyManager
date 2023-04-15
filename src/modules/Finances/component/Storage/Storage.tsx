import ChartWrapper from "../../../../components/ChartWrapper/ChartWrapper";
import styles from "./Storage.module.scss";

type Props = {};

const Storage: React.FC<Props> = () => {
  return (
    <>
      <h2>Storage</h2>

      <div className={styles.content}>
        <ChartWrapper
          data={[
            {
              id: "test",
              data: [
                {
                  x: "2323",
                  y: 2000,
                },
              ],
            },
          ]}
          title="Test"
        />
      </div>
    </>
  );
};
export default Storage;
