export const formatValue = (
  value: string | number | null | undefined,
  preSymbol?: string,
  postSymbol?: string
): string => {
  if (value == null) return "";

  let result = "";

  if (preSymbol) result += `${preSymbol} `;

  if (typeof value == "number")
    result += value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  else result += value;

  if (postSymbol) result += ` ${postSymbol}`;

  return result;
};

export const totalSum = ({ key, data }: { key: string; data: any[] }) => {
  return data.reduce((accum, cur) => {
    return accum + +cur[key];
  }, 0);
};
