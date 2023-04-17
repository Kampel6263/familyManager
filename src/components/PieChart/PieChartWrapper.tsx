import React, { useEffect, useState } from "react";
import styles from "./PieChartWrapper.module.scss";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import { formatValue, totalSum } from "../../helpers";
import Header from "../Header/Header";

type Props = {
  data: { name: string; value: number; fill?: string }[];

  title: string;
  sum: number;
};

const PieChartWrapper: React.FC<Props> = ({ data, title, sum }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const [test, setTest] = useState(0);

  useEffect(() => {}, [data]);
  const getRandomColor = () =>
    "#" + Math.floor(Math.random() * 11111123).toString(16);
  console.log(getRandomColor());
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + test * cos;
    const sy = cy + test * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 20) * sin;
    const ex = mx + (cos >= 0 ? 7 : -7);
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text
          className={styles.value}
          x={cx}
          y={cy}
          dy={-2}
          textAnchor="middle"
          fill={test === 0 ? "#000" : fill}
        >
          {test === 0 ? formatValue(sum, "₴") : formatValue(payload.value, "₴")}
        </text>
        <text
          className={styles.text}
          fontSize={20}
          x={cx}
          y={cy}
          dy={19}
          textAnchor="middle"
          fill={test === 0 ? "#000" : fill}
        >
          {test === 0 ? title : payload.name}
        </text>
        <Sector
          style={{ transition: ".5s" }}
          cx={sx}
          cy={sy}
          innerRadius={innerRadius + test}
          outerRadius={outerRadius + test}
          startAngle={startAngle}
          endAngle={endAngle}
          // onMouseOver={() => setTest(3)}
          // onMouseLeave={() => setTest(0)}
          fill={fill}
        />
        <Sector
          style={{ transition: ".5s" }}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 10}
          outerRadius={outerRadius + 15}
          startAngle={startAngle}
          endAngle={endAngle}
          onMouseOver={() => setTest(3)}
          onMouseLeave={() => setTest(0)}
          fill={"transparent"}
        />
        {/* <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        /> */}

        {/* <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}
        {/* <text
          className={styles.text}
          x={ex + (cos >= 0 ? 6 : -6)}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${value}`}</text>
        <text
          className={styles.text}
          x={ex + (cos >= 0 ? 6 : -6)}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text> */}
      </g>
    );
  };
  return (
    <div className={styles.pieChartWrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={330} height={330}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={(_: any, i) => onPieEnter(_, i)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || "red"} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartWrapper;
