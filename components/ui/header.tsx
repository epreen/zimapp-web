'use client';

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import HomeNavbar from "@/components/ui/navbars/home-navbar";
import StoreNavbar from "@/components/ui/navbars/store-navbar";

export default function Header() {
    const { isSignedIn } = useAuth();
    const pathname = usePathname();
    const isStore = pathname?.startsWith("/store");

    return isStore ? <StoreNavbar /> : <HomeNavbar />;
}