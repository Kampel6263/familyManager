import styles from "./Navbar.module.scss";
import { ReactComponent as WishList } from "../../assets/navbar/heart.svg";
import { ReactComponent as Todo } from "../../assets/navbar/todo.svg";
import { ReactComponent as CollapsSvg } from "../../assets/navbar/collapse-left.svg";
import { ReactComponent as Sibscribers } from "../../assets/navbar/subscribe.svg";
import { ReactComponent as Team } from "../../assets/navbar/team-svgrepo-com.svg";

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
      label: "Todo list",
      iconSvg: Todo,
    },
    {
      path: "sibscribers",
      label: "Sibscribers",
      iconSvg: Sibscribers,
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
    </div>
  );
};

export default Navbar;
