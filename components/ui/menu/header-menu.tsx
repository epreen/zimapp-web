"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerMenuItems } from "@/data";
import MobileMenu from "@/components/ui/menu/mobile-menu";

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <div className="border-t border-primary/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-2 lg:py-3 px-4">
        <div className="md:hidden">
          <MobileMenu />
        </div>

        <div className="hidden md:inline-flex gap-7 text-sm font-medium">
          {headerMenuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`relative text-foreground/60 hover:text-primary ${
                pathname === item.href ? "text-primary" : ""
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <Link
          href="/help"
          className="text-sm font-medium text-foreground/60 hover:text-primary"
        >
          Need Help?
        </Link>
      </div>
    </div>
  );
};

export default HeaderMenu;