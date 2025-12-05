"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
// import { Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/controls/theme-toggle";
// import { useSelector } from "react-redux";
// import { selectCartTotal } from "@/utils/slices/cart";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ManageStoresInline } from "@/components/ui/modals/manage-stores-modal"; // inline version of ManageStores
import { FaStore } from "react-icons/fa6";

interface HomeNavbarProps {
    userId: string
}

const HomeNavbar = ({userId}: HomeNavbarProps) => {
    const navRef = useRef<HTMLDivElement>(null);
    // const cartCount = useSelector(selectCartTotal);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        gsap.fromTo(
            navRef.current,
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Marketplace", href: "/marketplace" },
        { name: "Video feed", href: "/feed" },
        { name: "Business hub", href: "/dashboard" },
        { name: "About zimapp", href: "/about" },
    ];

    return (
        <motion.nav
            ref={navRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative border-b border-b-foreground/10 py-2"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-11">
                <Link href="/" className="flex items-center font-semibold text-2xl text-foreground">
                    <span className="text-primary dark:text-secondary">zim</span>app
                </Link>

                <ul className="hidden lg:flex items-center gap-8">
                    {/* {navLinks.map((link) => (
                        <motion.li
                            key={link.name}
                            whileHover={{ scale: 1, y: -2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Link
                                href={link.href}
                                className="text-[15px] font-medium text-foreground/60 hover:text-primary/40 dark:hover:text-secondary/40 transition-colors"
                            >
                                {link.name}
                            </Link>
                        </motion.li>
                    ))} */}
                </ul>

                <div className="flex items-center justify-center gap-4 relative">
                    <ThemeToggle />

                    {/* <Link
                        href="/marketplace/products/cart"
                        className="relative text-sm flex items-center gap-2 text-foreground/60"
                    >
                        <ShoppingCart size={18} />
                        Cart
                        <span className="absolute -top-1 left-3 text-[8px] bg-background text-foreground size-3.5 rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    </Link> */}

                    <SignedIn>
                        <div className="relative">
                            <UserButton>
                                <UserButton.UserProfilePage label="Stores" url="manage-store" labelIcon={<FaStore />}>
                                    <ManageStoresInline userId={userId} />
                                </UserButton.UserProfilePage>
                            </UserButton>
                        </div>
                    </SignedIn>

                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button className="gradient-primary dark:gradient-secondary text-background hover-glow shadow-lg transition-all duration-300">
                                Sign In
                            </Button>
                        </SignInButton>
                    </SignedOut>

                    {/* Mobile Sheet
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-foreground bg-background"
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="bg-background p-6">
                            <SheetHeader>
                                <VisuallyHidden>
                                    <SheetTitle>Mobile navigation menu</SheetTitle>
                                </VisuallyHidden>
                            </SheetHeader>

                            <ul className="space-y-5">
                                {navLinks.map((link) => (
                                    <motion.li
                                        key={link.name}
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="block text-lg font-medium text-foreground/60 hover:text-primary/40 dark:hover:text-secondary/40"
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </SheetContent>
                    </Sheet> */}
                </div>
            </div>
        </motion.nav>
    );
};

export default HomeNavbar;