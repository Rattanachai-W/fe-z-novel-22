"use client";

import type { IconType } from "react-icons";
import {
  FiBell,
  FiBookmark,
  FiBookOpen,
  FiEdit3,
  FiEye,
  FiHome,
  FiInfo,
  FiList,
  FiMenu,
  FiMoon,
  FiSearch,
  FiSun,
  FiTrash2,
  FiType,
} from "react-icons/fi";

type AppIconName =
  | "search"
  | "bell"
  | "bookmark"
  | "home"
  | "info"
  | "book-open"
  | "pen"
  | "list"
  | "text"
  | "moon"
  | "sun"
  | "eye"
  | "trash"
  | "ellipsis";

type AppIconProps = {
  name: AppIconName;
  className?: string;
};

const iconMap: Record<AppIconName, IconType> = {
  search: FiSearch,
  bell: FiBell,
  bookmark: FiBookmark,
  home: FiHome,
  info: FiInfo,
  "book-open": FiBookOpen,
  pen: FiEdit3,
  list: FiList,
  text: FiType,
  moon: FiMoon,
  sun: FiSun,
  eye: FiEye,
  trash: FiTrash2,
  ellipsis: FiMenu,
};

export function AppIcon({ name, className = "h-4 w-4" }: AppIconProps) {
  const Icon = iconMap[name];

  return <Icon className={className} aria-hidden />;
}
