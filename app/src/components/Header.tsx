import { LayoutGridIcon, Share2Icon } from "lucide-react";
import { Logo } from "./Logo";
import { Row } from "./base/Row";
import { toast } from "sonner";
import { useMainStore } from "../lib/mainStore";

export const Header = () => {
  const menus = [
    {
      icon: LayoutGridIcon,
      label: "Menu",
      onClick: () => {
        useMainStore.setState({ isMenuOpen: true });
      },
    },
    {
      icon: Share2Icon,
      label: "Share",
      onClick: () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success(" Link copied, share it with your friends!");
      },
    },
  ];

  return (
    <Row crossCenter className="gap-2 fixed top-0 left-0">
      <Logo />
      <div />
      {menus.map((menu, index) => (
        <Row
          key={index}
          center
          crossCenter
          className="gap-2 hover:bg-white transition-colors duration-200 ease-in-out rounded-md py-2 px-3 cursor-pointer select-none"
          onClick={menu.onClick}
        >
          <menu.icon size={18} />
          {menu.label}
        </Row>
      ))}
    </Row>
  );
};
