import Dog from "../../../assets/petsTypes/dog.png";
import Cat from "../../../assets/petsTypes/cat.png";
import dayjs from "dayjs";
export const getIconByPetType = (type: string) => {
  switch (type.toLowerCase()) {
    case "dog":
      return Dog;
    case "cat":
      return Cat;
  }
};

export const getPetAge = (birthdate: string) => {
  const currentDate = dayjs();

  const years = currentDate.diff(birthdate, "year");
  const months = currentDate.diff(birthdate, "month") % 12;
  const days = currentDate.diff(birthdate, "day") % 30;
  const age = `${years ? `${years} year${years > 1 ? "s" : ""}` : ""}  ${
    months ? `${months} month${months > 1 ? "s" : ""}` : ""
  } ${days ? `${days} day${days > 1 ? "s" : ""}` : ""}`;

  return age;
};

export const getDiffColor = (
  number: number,
  type: "last" | "next",
  opacity: number = 1
) => {
  const goodValue = number * 3.55;
  const badValue = 255 - number * 1.55;
  if (type === "next") {
    return `rgba(${number < 255 ? (badValue > 255 ? 235 : badValue - 20) : 0},${
      goodValue > 255 ? 235 : goodValue - 20
    },0,${opacity})`;
  }
  return `rgba(${number < 255 ? (goodValue > 255 ? 235 : goodValue - 20) : 0},${
    badValue > 255 ? 235 : badValue - 20
  },0,${opacity})`;
};
