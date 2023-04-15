import React from "react";
import styles from "./ChartWrapper.module.scss";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
type DataType = {
  id: string;
  data: {
    x: string | number;
    y: string | number;
  }[];
};

type Props = {
  title: string;
  data: DataType[];
};

const ChartWrapper: React.FC<Props> = ({ title }) => {
  const data: any[] = [
    {
      date: "2022-03-23",
      salary: 2000,
    },
    {
      date: "2022-04-23",
      salary: 2200,
    },
    {
      date: "2022-05-23",
      salary: 2500,
    },
    {
      date: "2022-06-23",
      salary: 2100,
    },
    {
      date: "2022-07-23",
      salary: 2800,
    },
    {
      date: "2022-08-23",
      salary: 800,
    },
    {
      date: "2022-09-23",
      salary: 1800,
    },
    {
      date: "2022-10-23",
      salary: 200,
    },
    {
      date: "2022-11-23",
      salary: 2800,
    },
    {
      date: "2022-12-23",
      salary: 5800,
    },
    {
      date: "2022-13-23",
      salary: 1800,
    },
  ];
  return (
    <div className={styles.chart}>
      <h3>{title}</h3>
      <div className={styles.container}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500} height={300} data={data}>
            <CartesianGrid />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="linear"
              dataKey="salary"
              stroke={"#000"}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartWrapper;
