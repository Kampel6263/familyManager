export type SpendingHistoryData = {
  comment?: string;
  label?: string;
  sum: number;
  date: string;
  userId: string;
  id: string;
};

export type SpendingDataType = {
  categoryName: string;
  categoryColor: string;
  allocatedSum: number;
  spendingSum: number;
  spendingHistory: SpendingHistoryData[];
  userIds: string[] | null;
  id: string;
};

export type LastCostUpdateType = {
  [key: string]: string;
};

export type LabelsDataType = {
  name: string;
  spend: number;
  userId: string | null;
  id: string;
};

export type CostsDataType = {
  month: string;
  allocatedFunds: number;
  spendingData: SpendingDataType[];
  closed: boolean;
  selected: boolean;
  id: string;
  lastCostUpdate: LastCostUpdateType;
  labelsData?: LabelsDataType[];
  endMonthDate?: number;
};
