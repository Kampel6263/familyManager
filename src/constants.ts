import youtubeIcon from "./assets/services/youtube.svg";
import telegramIcon from "./assets/services/telegram.png";
import netflixIcon from "./assets/services/netflix.png";
import voliaIcon from "./assets/services/volia.png";
import steamIcon from "./assets/services/steam.png";
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
    img: voliaIcon,
    label: "Volia",
    value: "volia",
  },
  {
    img: steamIcon,
    label: "Steam",
    value: "steam",
  },
  // TODO: lifecell, domofon,  voda, megogo
];
