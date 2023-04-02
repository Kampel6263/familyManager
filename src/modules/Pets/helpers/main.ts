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

export const getPetAge = (birthday: string) => {
  const totalMonth = dayjs(new Date()).diff(birthday, "month");
  const days = dayjs(new Date()).diff(birthday, "days");

  const years = Math.floor(totalMonth / 12);
  const month = totalMonth % 12;
  const ageString =
    month === 0
      ? days + ` day${days > 1 ? "s" : ""}`
      : `${years ? `${years} year${years > 1 ? "s" : ""}` : ""} ` +
        `${month ? `${month} month${month > 1 ? "s" : ""}` : ""}`;

  return ageString;
};
