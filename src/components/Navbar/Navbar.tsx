import styles from "./Navbar.module.scss";
import { ReactComponent as WishList } from "../../assets/navbar/heart.svg";
import { ReactComponent as Todo } from "../../assets/navbar/todo.svg";
import { ReactComponent as CollapsSvg } from "../../assets/navbar/collapse-left.svg";
import { ReactComponent as Sibscribers } from "../../assets/navbar/subscribe.svg";
import { ReactComponent as Team } from "../../assets/navbar/team-svgrepo-com.svg";
import { ReactComponent as Pets } from "../../assets//navbar/pets.svg";
import { ReactComponent as Finance } from "../../assets//navbar/finances.svg";

import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { useState } from "react";

type Props = {};

type NavbarItems = {
  path: string;
  label: string;
  iconSvg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

const Navbar: React.FC<Props> = () => {
  const navbarItems: NavbarItems[] = [
    {
      path: "wish-list",
      label: "Wish list",
      iconSvg: WishList,
    },

    {
      path: "todo-list",
      label: "To Do list",
      iconSvg: Todo,
    },
    {
      path: "sibscribers",
      label: "Sibscribers",
      iconSvg: Sibscribers,
    },
    {
      path: "finances",
      label: "Finances",
      iconSvg: Finance,
    },
    {
      path: "pets",
      label: "Pets",
      iconSvg: Pets,
    },
    {
      path: "team",
      label: "Team",
      iconSvg: Team,
    },
  ];

  const [open, setOpen] = useState(true);

  return (
    <div className={classNames(styles.navbar, open && styles.open)}>
      {navbarItems.map((el) => (
        <NavLink
          key={el.path}
          className={({ isActive }) =>
            classNames(styles.navbarItem, isActive && styles.active)
          }
          to={el.path}
        >
          <el.iconSvg />
          {open && <span>{el.label}</span>}
        </NavLink>
      ))}
      <div className={styles.navbarItem} onClick={() => setOpen(!open)}>
        <CollapsSvg className={open ? "" : styles.collaps} />{" "}
        {open && <span>Collaps</span>}
      </div>
      <div className={styles.version}>v_3.3</div>
    </div>
  );
};

export default Navbar;
