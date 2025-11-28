'use client';

import { usePathname } from "next/navigation";
import FootContainer from "@/components/ui/layouts/footer-container"; // adjust path if needed

export default function Footer() {
    const pathname = usePathname();
    const isStore = pathname?.startsWith("/store");

    // Hide footer on store pages
    if (isStore) return null;

    return <FootContainer />;
}
