import {
  BellRingIcon,
  HomeIcon,
  ServerIcon,
  SettingsIcon,
  Table2,
  Users2,
} from "lucide-react";

export const MenuItems = {
  Main: [
    {
      title: "Dashboard",
      icon: HomeIcon,
      href: "",
    },
    {
      title: "Members",
      icon: Users2,
      href: "/members",
    },
    {
      title: "Table",
      icon: Table2,
      href: "/tables",
    },
    {
      title: "Boards",
      icon: ServerIcon,
      href: "/boards",
    },
  ],
  Settings: [
    {
      title: "Notifications",
      icon: BellRingIcon,
      href: "/notifications",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: SettingsIcon,
    },
  ],
};
