import youtubeIcon from "./assets/services/youtube.svg";
import telegramIcon from "./assets/services/telegram.png";
import netflixIcon from "./assets/services/netflix.png";
import internet from "./assets/services/internet.png";
import steamIcon from "./assets/services/steam.png";
import megogoIcon from "./assets/services/megogo.png";
import { ServiceType } from "./models";

export const services: ServiceType[] = [
  {
    img: youtubeIcon,
    label: "YouTube",
    value: "youtube",
  },
  {
    img: telegramIcon,
    label: "Telegram",
    value: "telegram",
  },
  {
    img: netflixIcon,
    label: "Netflix",
    value: "netflix",
  },
  {
    img: internet,
    label: "Internet",
    value: "internet",
  },
  {
    img: steamIcon,
    label: "Steam",
    value: "steam",
  },
  {
    img: megogoIcon,
    label: "Megogo",
    value: "megogo",
  },
  // TODO: lifecell, domofon,  voda
];
